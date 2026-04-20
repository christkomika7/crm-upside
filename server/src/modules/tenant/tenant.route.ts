import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, uploadFiles } from "../../lib/storage";
import { hasOverdueRentals, safeSignedUrls } from "../../lib/utils";
import { tenantSchema } from "../../lib/zod/tenants";

import Decimal from "decimal.js";
import request from "./type";

export const tenantRoutes = new Elysia({ prefix: "/tenant" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server, query }) => {
        if (!canAccess(permission, "tenants", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const {
            page = "0",
            pageSize = "10",
            search = "",
            filter = "alpha",
            sortBy = "",
            sortOrder = "asc",
        } = query;

        const pageNum = parseInt(page);
        const pageSizeNum = parseInt(pageSize);
        const skip = pageNum * pageSizeNum;

        const searchCondition = search
            ? {
                OR: [
                    { firstname: { contains: search, mode: "insensitive" as const } },
                    { lastname: { contains: search, mode: "insensitive" as const } },
                    { company: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {};

        const allowedSortFields: Record<string, any> = {
            name: { firstname: sortOrder as "asc" | "desc" },
            company: { company: sortOrder as "asc" | "desc" },
            rent: { rentals: { _count: sortOrder as "asc" | "desc" } },
            monthlyRent: { monthlyRent: sortOrder as "asc" | "desc" },
            monthlyCharges: { monthlyCharges: sortOrder as "asc" | "desc" },
            depositPaid: { depositPaid: sortOrder as "asc" | "desc" },
            status: { rentals: { end: sortOrder as "asc" | "desc" } },
            createdAt: { createdAt: sortOrder as "asc" | "desc" },
        };

        const orderBy = (() => {
            if (sortBy && allowedSortFields[sortBy]) {
                return allowedSortFields[sortBy];
            }
            if (filter === "asc") return { createdAt: "asc" as const };
            if (filter === "desc") return { createdAt: "desc" as const };
            return { firstname: "asc" as const };
        })();

        const total = await prisma.tenant.count({ where: searchCondition });

        const tenants = await prisma.tenant.findMany({
            where: searchCondition,
            include: {
                rentals: true
            },
            orderBy,
            skip,
            take: pageSizeNum,
        });

        const data = await Promise.all(
            tenants.map(async (tenant) => {
                const rentals = tenant.rentals.length;
                return {
                    id: tenant.id,
                    name: `${tenant.firstname} ${tenant.lastname}`,
                    company: tenant.company || "",
                    rentedUnit: rentals,
                    monthlyRent: tenant.monthlyRent.toString(),
                    monthlyCharges: tenant.monthlyCharges.toString(),
                    depositPaid: tenant.depositPaid.toString(),
                    status: hasOverdueRentals(tenant.rentals) ? "OVERDUE" : "UP_TO_DATE",
                    createdAt: tenant.createdAt
                };
            })
        );

        return {
            data: data,
            total: data.length,
            pageSize: pageSizeNum,
            pageCount: Math.ceil(total / pageSizeNum),
        };

    }, {
        auth: true,
        query: request.queryFilter,
    })
    .get("/list", async ({ permission, status, server, query }) => {
        if (!canAccess(permission, "tenants", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const tenants = await prisma.tenant.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
            }
        });

        return tenants.map(tenant => ({
            value: tenant.id,
            label: `${tenant.firstname} ${tenant.lastname}`
        }))
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
                    income: data.income ? new Decimal(data.income) : undefined,
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

        if (!tenant) return status(404, { message: "Locataire non trouvé" });
        if (tenant.isDeleting) return status(400, { message: "La suppression de ce locataire est en cours. Aucune modification n'est possible." });

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

            await prisma.$transaction(async tx => {
                await tx.tenant.update({
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
                        income: data.income ? new Decimal(data.income) : undefined,
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
            })


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
            where: { id },
            include: {
                rentals: true,
                invoices: true,
                quotes: true,
                appointments: true,
                checkInOuts: true,
            }
        });

        if (!tenant) return status(400, { message: "Aucun locataire trouvée." });
        if (tenant.isDeleting) return status(400, { message: "La suppression de ce locataire est déjà en cours. Merci de patienter quelques instants." });
        if (tenant.rentals.length > 0) return status(400, { message: "Impossible de supprimer ce locataire : il a encore des locations actives. Veuillez les clôturer avant." });
        if (tenant.invoices.length > 0) return status(400, { message: "Impossible de supprimer ce locataire : des factures sont associées à son compte." });
        if (tenant.quotes.length > 0) return status(400, { message: "Impossible de supprimer ce locataire : des devis sont encore liés à ce locataire." });
        if (tenant.appointments.length > 0) return status(400, { message: "Impossible de supprimer ce locataire : des rendez-vous sont encore planifiés." });
        if (tenant.checkInOuts.length > 0) return status(400, { message: "Impossible de supprimer ce locataire : des états des lieux y sont enregistrés." });

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

