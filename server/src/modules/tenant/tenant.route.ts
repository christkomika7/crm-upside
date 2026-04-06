import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, uploadFiles } from "../../lib/storage";
import { safeSignedUrls } from "../../lib/utils";
import { tenantSchema } from "../../lib/zod/tenants";

import Decimal from "decimal.js";
import request from "./type";

export const tenantRoutes = new Elysia({ prefix: "/tenant" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server }) => {

        if (!canAccess(permission, "tenants", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const tenants = await prisma.tenant.findMany({
            orderBy: { createdAt: "desc" },
        });

        const tenantsWithSignedUrl = await Promise.all(
            tenants.map(async (tenant) => {
                const documents = await safeSignedUrls(tenant.documents);

                if (documents.error) {
                    server?.publish("storage-error",
                        "Certaines images n'ont pas pu être chargées depuis le storage"
                    );

                }

                return {
                    ...tenant,
                    name: `${tenant.firstname} ${tenant.lastname}`,
                    rentedUnit: "-",
                    monthlyRent: "-",
                    charges: "-",
                    depositPaid: "-",
                    status: "-",
                    documents: documents.urls,
                };
            })
        );

        return tenantsWithSignedUrl;

    }, {
        auth: true,
    })
    .get("/:id", async ({ params, permission, status, server }) => {
        if (!canAccess(permission, "tenants", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const tenant = await prisma.tenant.findUnique({
            where: { id: params.id },
        });

        if (!tenant) {
            return status(404, { message: "Aucun locataire trouvé" });
        }

        const documents = await safeSignedUrls(tenant.documents);

        if (documents.error) {
            server?.publish("storage-error",
                "Certaines images ou documents n'ont pas pu être chargés depuis le storage"
            );

        }
        return {
            ...tenant,
            documents: documents.urls
        };

    }, { auth: true, params: request.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "tenants", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = tenantSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations du locataire sont invalide" });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents) as string[];
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.tenant.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    company: data.company,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    income: new Decimal(data.income),
                    bankInfo: data.bankInfo,
                    maritalStatus: data.maritalStatus,
                    paymentMode: data.paymentMode,
                    documents,
                },
            });

            return status(201, { message: "Locataire créé avec succès" });

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
                message: "Erreur lors de la création du locataire",
            });
        }
    },
        {
            auth: true,
            body: request.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "tenants", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const tenant = await prisma.tenant.findUnique({
            where: { id },
        });

        if (!tenant) {
            return status(404, { message: "Locataire non trouvé" });
        }

        const oldKeys = [...tenant.documents];

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = tenantSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations du locataire sont invalide" });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents) as string[];
            } catch (error) {
                console.error(JSON.stringify(error));
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.tenant.update({
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
                    income: new Decimal(data.income),
                    bankInfo: data.bankInfo,
                    maritalStatus: data.maritalStatus,
                    paymentMode: data.paymentMode,
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

            return status(201, { message: "Locataire modifié avec succès" });

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
                message: "Erreur lors de la modification du locataire",
            });
        }



    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "tenants", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const tenant = await prisma.tenant.findUnique({
            where: { id }
        });

        if (!tenant) return status(400, { message: "Aucun locataire trouvée." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: tenant.id,
                    type: "TENANT",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.tenant.update({
                where: { id: tenant.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression du locataire ${tenant.firstname} ${tenant.lastname} est en attente de suppression.` });
    }, { auth: true, params: request.params })

