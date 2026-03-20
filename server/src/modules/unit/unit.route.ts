import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, getSignedFileUrl, uploadFiles } from "../../lib/storage";
import { getUnitAmenities, safeSignedUrls } from "../../lib/utils";
import requestType from "./type";
import Decimal from "decimal.js";
import { unitSchema } from "../../lib/zod/units";

export const unitRoutes = new Elysia({ prefix: "/unit" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server }) => {

        if (!canAccess(permission, "units", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const units = await prisma.unit.findMany({
            include: { type: true, building: true },
            orderBy: { createdAt: "desc" },
        });

        const unitsWithSignedUrl = await Promise.all(
            units.map(async (unit) => {
                const documents = await safeSignedUrls(unit.documents);

                if (documents.error) {
                    server?.publish("storage-error",
                        "Certaines images n'ont pas pu être chargées depuis le storage"
                    );
                }

                return {
                    ...unit,
                    building: unit.building.name,
                    owner: "-",
                    tenant: "-",
                    status: "-",
                    rent: new Decimal(unit.rent).plus(unit.charges),
                    service: getUnitAmenities(unit),
                    documents: documents.urls,
                };
            })
        );

        return unitsWithSignedUrl;

    }, {
        auth: true,
    })
    .get("/by", async ({ permission, status, params, query }) => {

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
        query: requestType.query
    })
    .get("/:id", async ({ params, permission, status, server }) => {

        if (!canAccess(permission, "units", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const unit = await prisma.unit.findUnique({
            where: { id: params.id },
            include: {
                type: true,
                building: true
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

        const documents = await safeSignedUrls(unit.documents);

        if (documents.error) {
            server?.publish("storage-error",
                "Certaines images ou documents n'ont pas pu être chargés depuis le storage"
            );

        }
        return {
            ...unit,
            documents: documents.urls
        };

    }, { auth: true, params: requestType.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "units", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const parsedBody = {
            ...body,
            wifi: JSON.parse(body.wifi),
            water: JSON.parse(body.water),
            electricity: JSON.parse(body.electricity),
            tv: JSON.parse(body.tv),
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = unitSchema.safeParse(parsedBody);

            if (!success) {
                return status(400, { message: "Unité invalide" });
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
                    rentalStatus: data.rentalStatus,
                    surface: data.surface,
                    rooms: data.rooms,
                    rent: data.rent,
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

            return status(500, {
                message: "Erreur lors de la création du bâtiment",
            });
        }
    },
        {
            auth: true,
            body: requestType.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "units", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;

        const parsedBody = {
            ...body,
            wifi: JSON.parse(body.wifi),
            water: JSON.parse(body.water),
            electricity: JSON.parse(body.electricity),
            tv: JSON.parse(body.tv),
        }

        const unit = await prisma.unit.findUnique({
            where: { id },
        });

        if (!unit) {
            return status(404, { message: "Unité non trouvée" });
        }

        const oldKeys = [...unit.documents];

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = unitSchema.safeParse(parsedBody);

            if (!success) {
                return status(400, { message: "Unité invalide" });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(JSON.stringify(error));
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.unit.update({
                where: {
                    id: params.id
                },
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
                    rentalStatus: data.rentalStatus,
                    surface: data.surface,
                    rooms: data.rooms,
                    rent: data.rent,
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

            return status(201, { message: "Unité modifié avec succès" });

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
                message: "Erreur lors de la modification du bâtiment",
            });
        }



    }, { auth: true, body: requestType.body, params: requestType.params })
    .delete("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "units", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const unit = await prisma.unit.delete({
            where: { id },
        });


        if (unit.documents) {
            await Promise.all(unit.documents.map(async (key) => {
                await deleteFile(key)
            }))
        }

        return { message: "Unité supprimé avec succès" };
    }, { auth: true })

