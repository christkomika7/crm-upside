import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, uploadFiles } from "../../lib/storage";
import { safeSignedUrls } from "../../lib/utils";
import request from "./type";
import { ownerSchema } from "../../lib/zod/owners";
import { Prisma } from "../../generated/prisma/client";

export const ownerRoutes = new Elysia({ prefix: "/owner" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server, query }) => {

        if (!canAccess(permission, "owners", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const PAGE_SIZE = 10;
        const page = Math.max(1, Number(query.page) || 1);
        const search = (query.search as string)?.trim() || "";
        const sort = (query.sort as string) || "alpha";

        const orderBy =
            sort === "asc"
                ? { createdAt: "asc" as const }
                : sort === "desc"
                    ? { createdAt: "desc" as const }
                    : [{ firstname: "asc" as const }, { lastname: "asc" as const }];

        const where = search
            ? {
                OR: [
                    { firstname: { contains: search, mode: "insensitive" as const } },
                    { lastname: { contains: search, mode: "insensitive" as const } },
                    { reference: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                    { phone: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {};

        const total = await prisma.owner.count({ where });
        const pageCount = Math.ceil(total / PAGE_SIZE);

        const owners = await prisma.owner.findMany({
            where,
            include: {
                buildings: {
                    include: {
                        units: true,
                    },
                },
            },
            orderBy,
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        });

        const ownersWithSignedUrl = await Promise.all(
            owners.map(async (owner) => {
                const documents = await safeSignedUrls(owner.documents);

                if (documents.error) {
                    server?.publish(
                        "storage-error",
                        "Certaines images n'ont pas pu être chargées depuis le storage"
                    );
                }

                return {
                    ...owner,
                    name: `${owner.firstname} ${owner.lastname}`,
                    properties: owner.buildings.length || 0,
                    units: owner.buildings.reduce(
                        (acc, building) => acc + building.units.length,
                        0
                    ),
                    revenue: "-",
                    documents: documents.urls,
                };
            })
        );

        return {
            data: ownersWithSignedUrl,
            total,
            pageCount,
            page,
        };
    }, {
        auth: true,
        query: t.Object({
            page: t.Optional(t.String()),
            search: t.Optional(t.String()),
            sort: t.Optional(t.String()),
        }),
    })
    .get("/:id", async ({ params, permission, status, server }) => {
        if (!canAccess(permission, "owners", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const owner = await prisma.owner.findUnique({
            where: { id: params.id },
            include: {
                buildings: {
                    include: {
                        units: true
                    }
                }
            }
        });

        if (!owner) {
            return status(404, { message: "Aucun propriétaire trouvé" });
        }

        const documents = await safeSignedUrls(owner.documents);

        if (documents.error) {
            server?.publish("storage-error",
                "Certaines images ou documents n'ont pas pu être chargés depuis le storage"
            );

        }
        return {
            ...owner,
            buildings: owner.buildings.map(building => building.id),
            documents: documents.urls
        };

    }, { auth: true, params: request.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "owners", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = ownerSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations du propriétaire sont invalide" });
            }

            const existingOwner = await prisma.owner.findUnique({
                where: { reference: data.reference },
            });

            if (existingOwner) {
                return status(400, {
                    message: `La référence ${data.reference} est déjà utilisée.`,
                });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.owner.create({
                data: {
                    reference: data.reference,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    company: data.company,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    actionnary: data.actionnary,
                    bankInfo: data.bankInfo,
                    documents,
                    buildings: {
                        connect: data.buildings.map((building) => ({ id: building })),
                    }
                },
            });

            return status(201, { message: "Propriétaire créé avec succès" });

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
                message: "Erreur lors de la création du propriétaire",
            });
        }
    },
        {
            auth: true,
            body: request.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "owners", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const owner = await prisma.owner.findUnique({
            where: { id },
        });


        if (!owner) {
            return status(404, { message: "Propriétaire non trouvé" });
        }

        const oldKeys = [...owner.documents];

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = ownerSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations du propriétaire sont invalide" });
            }

            const existingOwner = await prisma.owner.findFirst({
                where: {
                    reference: data.reference,
                    NOT: { id: params.id }
                }
            });

            if (existingOwner) {
                return status(400, {
                    message: `La référence ${data.reference} est déjà utilisée.`
                });
            }


            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(JSON.stringify(error));
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.owner.update({
                where: {
                    id: params.id
                },
                data: {
                    reference: data.reference,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    company: data.company,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    actionnary: data.actionnary,
                    bankInfo: data.bankInfo,
                    documents,
                    buildings: {
                        set: data.buildings.map((building) => ({ id: building })),
                    }
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

            return status(201, { message: "Propriétaire modifié avec succès" });

        } catch (error) {

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
                message: "Erreur lors de la modification du propriétaire",
            });
        }
    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, user, status }) => {
        if (!canAccess(permission, "owners", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;
        const owner = await prisma.owner.findUnique({
            where: { id },
        });

        if (!owner) return status(400, { message: "Aucun propriétaire trouvé." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: owner.id,
                    type: "OWNER",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.owner.update({
                where: { id: owner.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression du propriétaire ${owner.firstname} ${owner.lastname} est en attente de validation.` });
    }, { auth: true, params: request.params })

