import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, getSignedFileUrl, uploadFiles } from "../../lib/storage";
import { getUnitAmenities, safeSignedUrls } from "../../lib/utils";
import request from "./type";
import Decimal from "decimal.js";
import { unitSchema } from "../../lib/zod/units";
import { Prisma } from "../../generated/prisma/client";

export const unitRoutes = new Elysia({ prefix: "/unit" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server, query }) => {
        if (!canAccess(permission, "units", "read")) {
            return status(403, { message: "Accès refusé" });
        }
        const {
            page = "0",
            pageSize = "10",
            search = "",
            filter = "alpha",
        } = query;

        const pageNum = parseInt(page);
        const pageSizeNum = parseInt(pageSize);
        const skip = pageNum * pageSizeNum;

        const searchCondition = search
            ? {
                OR: [
                    { reference: { contains: search, mode: "insensitive" as const } },
                    { building: { name: { contains: search, mode: "insensitive" as const } } },
                    { building: { owner: { firstname: { contains: search, mode: "insensitive" as const } } } },
                    { building: { owner: { lastname: { contains: search, mode: "insensitive" as const } } } },
                    {
                        rentals: {
                            some: {
                                tenant: {
                                    OR: [
                                        { firstname: { contains: search, mode: "insensitive" as const } },
                                        { lastname: { contains: search, mode: "insensitive" as const } },
                                    ],
                                },
                            },
                        },
                    },
                ],
            }
            : {};

        const orderBy = (() => {
            if (filter === "asc") return { createdAt: "asc" as const };
            if (filter === "desc") return { createdAt: "desc" as const };
            return { reference: "asc" as const };
        })();

        const total = await prisma.unit.count({ where: searchCondition });

        const units = await prisma.unit.findMany({
            where: searchCondition,
            include: {
                type: true,
                building: {
                    include: { owner: true },
                },
                rentals: {
                    include: { tenant: true },
                },
            },
            orderBy,
            skip,
            take: pageSizeNum,
        });

        let hasImageError = false;

        const unitsWithSignedUrl = await Promise.all(
            units.map(async (unit) => {
                const documents = await safeSignedUrls(unit.documents);
                const tenant = unit.rentals.find((r) => r.unitId === unit.id)?.tenant;

                if (documents.error) {
                    hasImageError = true
                }

                return {
                    ...unit,
                    building: unit.building.name,
                    owner: unit.building.owner
                        ? `${unit.building.owner.firstname} ${unit.building.owner.lastname}`
                        : "-",
                    isDeleting: unit.isDeleting,
                    tenant: tenant ? `${tenant.firstname} ${tenant.lastname}` : "-",
                    status: tenant ? "rented" : "vacant",
                    rent: (new Decimal(unit.rent).plus(unit.charges)).toNumber(),
                    service: getUnitAmenities(unit),
                    documents: documents.urls,
                };
            })
        );

        if (hasImageError) {
            server?.publish(
                "error",
                JSON.stringify({
                    type: "error",
                    message: "Certaines images n'ont pas pu être chargées.",
                })
            );
        }

        return {
            data: unitsWithSignedUrl,
            total,
            page: pageNum,
            pageSize: pageSizeNum,
            pageCount: Math.ceil(total / pageSizeNum),
        };
    }, {
        auth: true,
        query: request.queryFilter,
    })
    .get("/valid", async ({ permission, status, server }) => {
        if (!canAccess(permission, "units", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const now = new Date();

        const units = await prisma.unit.findMany({
            where: {
                OR: [
                    {
                        rentals: {
                            none: {},
                        },
                    },
                    {
                        rentals: {
                            some: {
                                end: {
                                    lt: now,
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                reference: true,
            },
        });
        return units;

    }, {
        auth: true,
    })
    .get("/by", async ({ permission, status, query }) => {

        if (!canAccess(permission, "units", "read")) {
            return status(403, { message: "Accès refusé" });
        }
        const units = await prisma.unit.findMany({
            where: {
                buildingId: query.id
            },
            include: { type: true, building: true },
            orderBy: { createdAt: "desc" },
        });

        return units
    }, {
        auth: true,
        query: request.query
    })
    .get("/:id", async ({ params, permission, status, server }) => {

        if (!canAccess(permission, "units", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const unit = await prisma.unit.findUnique({
            where: { id: params.id },
            include: {
                type: true,
                building: true,
                rentals: {
                    include: {
                        tenant: true
                    }
                }

            }
        });

        if (!unit) {
            return status(404, { message: "Aucun bâtiment trouvé" });
        }

        async function safeSignedUrls(keys?: string[]) {
            if (!keys?.length) {
                return { urls: [], error: false };
            }

            const results = await Promise.allSettled(
                keys.map((key) => getSignedFileUrl(key))
            );

            const urls = results
                .filter((r) => r.status === "fulfilled")
                .map((r: any) => r.value);

            const error = results.some((r) => r.status === "rejected");

            return { urls, error };
        }

        const tenant = unit.rentals.find((r) => r.unitId === unit.id)?.tenant;


        const documents = await safeSignedUrls(unit.documents);

        if (documents.error) {
            server?.publish("storage-error",
                "Certaines images ou documents n'ont pas pu être chargés depuis le storage"
            );

        }
        return {
            ...unit,
            status: tenant ? "rented" : "vacant",
            tenantName: tenant ? `${tenant.firstname} ${tenant.lastname}` : "Aucun",
            tenantEmail: tenant ? tenant.email : "Aucun",
            tenantContact: tenant ? tenant.phone : "Aucun",
            service: getUnitAmenities(unit),
            documents: documents.urls
        };

    }, { auth: true, params: request.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "units", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = unitSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Unité invalide" });
            }


            const [existingType, existingUnit, existingBuilding] = await prisma.$transaction([
                prisma.type.findUnique({
                    where: { id: data.type }
                }),
                prisma.unit.findUnique({
                    where: { reference: data.reference },
                }),
                prisma.building.findUnique({
                    where: { id: data.building }
                })
            ])

            if (existingUnit) {
                return status(400, {
                    message: `L'unité ${data.reference} existe déjà`,
                });
            }

            if (!existingType) {
                return status(400, {
                    message: `Le type ${data.type} n'existe pas`,
                });
            }


            if (!existingBuilding) {
                return status(400, {
                    message: `Le bâtiment ${data.building} n'existe pas`,
                });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.unit.create({
                data: {
                    type: {
                        connect: {
                            id: data.type
                        }
                    },
                    building: {
                        connect: {
                            id: data.building
                        }
                    },
                    reference: data.reference,
                    rentalStatus: data.rentalStatus,
                    surface: data.surface,
                    livingroom: data.livingroom,
                    rent: data.rent,
                    dining: data.dining,
                    kitchen: data.kitchen,
                    bedroom: data.bedroom,
                    bathroom: data.bathroom,
                    furnished: data.furnished,
                    wifi: data.wifi,
                    water: data.water,
                    electricity: data.electricity,
                    tv: data.tv,
                    charges: data.charges,
                    documents,
                },
            });

            return status(201, { message: "Unité créée avec succès" });

        } catch (error) {
            console.error(error);

            await Promise.all(
                uploadedKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return status(400, {
                        message: "Cette référence existe déjà"
                    });
                }
            }

            return status(500, {
                message: "Erreur lors de la création du bâtiment",
            });
        }
    },
        {
            auth: true,
            body: request.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "units", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = unitSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Unité invalide" });
            }

            const [existingReference, unit, existingType, existingBuilding] = await prisma.$transaction([
                prisma.unit.findFirst({
                    where: {
                        reference: data.reference,
                        NOT: { id: params.id }
                    }
                }),
                prisma.unit.findUnique({
                    where: { id: params.id }
                }),
                prisma.type.findUnique({
                    where: { id: data.type }
                }),
                prisma.building.findUnique({
                    where: { id: data.building }
                }),
            ]);

            if (!unit) return status(404, { message: "Unité non trouvée" });
            if (unit.isDeleting) return status(400, { message: "L'unité est en cours de suppression" });
            if (existingReference) return status(400, { message: `L'unité ${data.reference} existe déjà` });
            if (!existingType) return status(400, { message: "Le type d'unité sélectionné n'existe pas" });
            if (!existingBuilding) return status(400, { message: "Le bâtiment sélectionné n'existe pas" });

            const oldKeys = [...unit.documents];

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(JSON.stringify(error));
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.$transaction(async (tx) => {
                await tx.unit.update({
                    where: { id: params.id },
                    data: {
                        type: { connect: { id: data.type } },
                        building: { connect: { id: data.building } },
                        reference: data.reference,
                        rentalStatus: data.rentalStatus,
                        surface: data.surface,
                        livingroom: data.livingroom,
                        rent: data.rent,
                        dining: data.dining,
                        kitchen: data.kitchen,
                        bedroom: data.bedroom,
                        bathroom: data.bathroom,
                        furnished: data.furnished,
                        wifi: data.wifi,
                        water: data.water,
                        electricity: data.electricity,
                        tv: data.tv,
                        charges: data.charges,
                        documents,
                    },
                });

                await Promise.all(
                    oldKeys.map(async (key) => {
                        try {
                            await deleteFile(key);
                        } catch (e) {
                            console.error("Erreur suppression fichier:", key, e);
                        }
                    })
                );
            });

            return status(200, { message: "Unité modifiée avec succès" });

        } catch (error) {
            console.error(error);

            await Promise.all(
                uploadedKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return status(400, { message: "Cette référence existe déjà" });
                }
            }

            return status(500, { message: "Erreur lors de la modification de l'unité" });
        }

    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "units", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const unit = await prisma.unit.findUnique({
            where: { id },
            include: {
                rentals: true,
                reservations: true,
                propertyManagements: true,
                checkInOuts: true
            }
        });

        if (!unit) return status(400, { message: "Aucune unité trouvée." });
        if (unit.rentals.length > 0 || unit.reservations.length > 0 || unit.propertyManagements.length > 0 || unit.checkInOuts.length > 0) return status(400, { message: "L'unité est déjà louée, réservée, en attente de visite pour l'état des lieux ou en cours de gestion." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: unit.id,
                    type: "UNIT",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.unit.update({
                where: { id: unit.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression de l'unité ${unit.reference} est en attente de suppression.` });
    }, { auth: true, params: request.params })

