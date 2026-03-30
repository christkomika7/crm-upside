import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, getSignedFileUrl, uploadFiles } from "../../lib/storage";
import { buildingSchema } from "../../lib/zod/building";
import { Decimal } from "decimal.js"
import request from "./type";
import { safeSignedUrls } from "../../lib/utils";
import { Prisma } from "../../generated/prisma/client";

export const buildingRoutes = new Elysia({ prefix: "/building" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server }) => {

        if (!canAccess(permission, "buildings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const buildings = await prisma.building.findMany({
            include: { lotTypes: true, owner: true, units: true },
            orderBy: { createdAt: "desc" },
        });

        const buildingsWithSignedUrl = await Promise.all(
            buildings.map(async (building) => {

                const photos = await safeSignedUrls(building.photos);
                const deeds = await safeSignedUrls(building.deeds);
                const documents = await safeSignedUrls(building.documents);

                if (photos.error || deeds.error || documents.error) {

                    server?.publish("storage-error",
                        "Certaines images n'ont pas pu être chargées depuis le storage"
                    );

                }

                return {
                    ...building,
                    owner: building.owner ? `${building.owner?.firstname} ${building.owner?.lastname}` : "-",
                    unit: building.units.length,
                    occupancy: "-",
                    photos: photos.urls,
                    deeds: deeds.urls,
                    documents: documents.urls,
                };
            })
        );

        return buildingsWithSignedUrl;

    }, {
        auth: true,
    })
    .get("/without-owner", async ({ permission, status, server }) => {

        if (!canAccess(permission, "buildings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const buildings = await prisma.building.findMany({
            where: {
                ownerId: null,
            },
            select: { id: true, name: true }
        });

        return buildings;

    }, {
        auth: true,
    })
    .get("/available-for-owner/:ownerId", async ({ params, permission, status }) => {

        if (!canAccess(permission, "buildings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const { ownerId } = params;

        const buildings = await prisma.building.findMany({
            where: {
                OR: [
                    { ownerId: null },
                    { ownerId: ownerId },
                ],
            },
            select: { id: true, name: true }
        });

        return buildings;
    }, { auth: true, params: request.paramOwnerId })
    .get("/:id", async ({ params, permission, status, server }) => {

        if (!canAccess(permission, "buildings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const building = await prisma.building.findUnique({
            where: { id: params.id },
            include: {
                lotTypes: true
            }
        });

        if (!building) {
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

        const photos = await safeSignedUrls(building.photos);
        const deeds = await safeSignedUrls(building.deeds);
        const documents = await safeSignedUrls(building.documents);

        if (photos.error || deeds.error || documents.error) {
            server?.publish("storage-error",
                "Certaines images ou documents n'ont pas pu être chargés depuis le storage"
            );

        }
        return {
            ...building,
            photos: photos.urls,
            deeds: deeds.urls,
            documents: documents.urls
        };

    }, { auth: true, params: request.paramId })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "buildings", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = buildingSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Bâtiment invalide" });
            }

            const existingBuilding = await prisma.building.findUnique({
                where: { reference: data.reference },
            });

            if (existingBuilding) {
                return status(400, {
                    message: `La référence ${data.reference} est déjà utilisée.`
                });
            }

            let photos: string[] = [];
            let deeds: string[] = [];
            let documents: string[] = [];

            try {
                photos = await uploadFiles(uploadedKeys, data.photos);
                deeds = await uploadFiles(uploadedKeys, data.deeds);
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.building.create({
                data: {
                    name: data.name,
                    reference: data.reference,
                    location: data.location,
                    constructionDate: data.constructionDate,
                    door: Number(data.door),
                    elevator: data.elevator,
                    parking: data.parking,
                    security: data.security,
                    camera: data.camera,
                    parkingPrice: new Decimal(data.parkingPrice),
                    pool: data.pool,
                    generator: data.generator,
                    waterBorehole: data.waterBorehole,
                    gym: data.gym,
                    garden: data.garden,
                    status: data.status,
                    map: data.map,
                    photos,
                    deeds,
                    documents,
                    lotTypes: {
                        connect: data.lotType.map((id: string) => ({ id })),
                    },
                },
            });

            return status(201, { message: "Bâtiment créé avec succès" });

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
        if (!canAccess(permission, "buildings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;

        const building = await prisma.building.findUnique({
            where: { id },
        });

        if (building?.isDeleting) {
            return status(400, { message: "Bâtiment en cours de suppression" });
        }

        if (!building) {
            return status(404, { message: "Bâtiment non trouvé" });
        }

        const oldKeys = [...building.photos, ...building.deeds, ...building.documents];

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = buildingSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Bâtiment invalide" });
            }

            const existingBuilding = await prisma.building.findFirst({
                where: {
                    reference: data.reference,
                    NOT: { id: params.id }
                }
            });

            if (existingBuilding) {
                return status(400, {
                    message: `La référence ${data.reference} est déjà utilisée.`
                });
            }

            let photos: string[] = [];
            let deeds: string[] = [];
            let documents: string[] = [];

            try {
                photos = await uploadFiles(uploadedKeys, data.photos);
                deeds = await uploadFiles(uploadedKeys, data.deeds);
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(JSON.stringify(error));
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.building.update({
                where: {
                    id: params.id
                },
                data: {
                    name: data.name,
                    reference: data.reference,
                    location: data.location,
                    constructionDate: data.constructionDate,
                    door: Number(data.door),
                    elevator: data.elevator,
                    parking: data.parking,
                    security: data.security,
                    camera: data.camera,
                    parkingPrice: new Decimal(data.parkingPrice),
                    pool: data.pool,
                    generator: data.generator,
                    waterBorehole: data.waterBorehole,
                    gym: data.gym,
                    garden: data.garden,
                    status: data.status,
                    map: data.map,
                    photos,
                    deeds,
                    documents,
                    lotTypes: {
                        set: data.lotType.map((id: string) => ({ id })),
                    },
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

            return status(201, { message: "Bâtiment modifié avec succès" });

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
                message: "Erreur lors de la modification du bâtiment",
            });
        }



    }, { auth: true, body: request.body, params: request.paramId })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "buildings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const building = await prisma.building.findUnique({
            where: { id },
            include: {
                units: true,
                owner: true,
            }
        });

        if (!building) return status(400, { message: "Aucun bàtiment trouvée." });

        if (building.units.length > 0) return status(400, { message: "Des unitées sont reliées à ce bâtiment." });
        if (building.owner) return status(400, { message: `Ce bâtiment est reliés au propriétaire ${building.owner.firstname} ${building.owner.lastname} .` });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: building.id,
                    type: "BUILDING",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.building.update({
                where: { id: building.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression de ${building.name} est en attente de validation.` });
    }, { auth: true, params: request.paramId })

