import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, uploadFiles } from "../../lib/storage";
import { safeSignedUrls } from "../../lib/utils";
import requestType from "./type";
import { ownerSchema } from "../../lib/zod/owners";

export const ownerRoutes = new Elysia({ prefix: "/owner" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server }) => {

        if (!canAccess(permission, "owners", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const owners = await prisma.owner.findMany({
            include: {
                buildings: {
                    include: {
                        units: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const ownersWithSignedUrl = await Promise.all(
            owners.map(async (owner) => {
                const documents = await safeSignedUrls(owner.documents);

                if (documents.error) {
                    server?.publish("storage-error",
                        "Certaines images n'ont pas pu être chargées depuis le storage"
                    );

                }

                return {
                    ...owner,
                    name: `${owner.firstname} ${owner.lastname}`,
                    properties: owner.buildings.length || 0,
                    units: owner.buildings.reduce((acc, building) => acc + building.units.length, 0),
                    revenue: "-",
                    documents: documents.urls,
                };
            })
        );

        return ownersWithSignedUrl;

    }, {
        auth: true,
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

    }, { auth: true, params: requestType.params })
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

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.owner.create({
                data: {
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

            return status(500, {
                message: "Erreur lors de la création du propriétaire",
            });
        }
    },
        {
            auth: true,
            body: requestType.body
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

            return status(500, {
                message: "Erreur lors de la modification du propriétaire",
            });
        }



    }, { auth: true, body: requestType.body, params: requestType.params })
    .delete("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "owners", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const owner = await prisma.owner.delete({
            where: { id },
        });


        if (owner.documents) {
            await Promise.all(owner.documents.map(async (key) => {
                await deleteFile(key)
            }))
        }

        return { message: "Propriétaire supprimé avec succès" };
    }, { auth: true })

