import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, uploadFiles } from "../../lib/storage";
import { formatDateToString, safeSignedUrls } from "../../lib/utils";
import request from "./type";
import { incomeAccountingSchema, outcomeAccountingSchema } from "../../lib/zod/accounting";
import Decimal from "decimal.js";

export const accountingRoutes = new Elysia({ prefix: "/accounting" })
    .use(authPlugin)
    .get("/", async ({ permission, status, server, query }) => {

        if (!canAccess(permission, "accounting", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const PAGE_SIZE = 10;
        const page = Math.max(1, Number(query.page) || 1);
        const search = (query.search as string)?.trim() || "";
        const sort = (query.sort as string) || "alpha";

        const orderBy =
            sort === "asc"
                ? { date: "asc" as const }
                : { date: "asc" as const };

        const where = search
            ? {
                OR: [
                    { description: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {};

        const total = await prisma.accounting.count({ where });
        const pageCount = Math.ceil(total / PAGE_SIZE);

        const accountings = await prisma.accounting.findMany({
            where,
            include: {
                category: {
                    select: { name: true }
                },
                nature: {
                    select: { name: true }
                },
                secondNature: {
                    select: { name: true }
                },
                thirdNature: {
                    select: { name: true }
                },
                allocation: {
                    select: { name: true }
                },
                source: {
                    select: { name: true }
                },
                unit: {
                    select: { reference: true }
                }
            },
            orderBy,
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        });

        let hasError = false;

        const accountingsWithSignedUrl = await Promise.all(
            accountings.map(async (accounting) => {
                const documents = await safeSignedUrls(accounting.documents);

                if (documents.error) {
                    hasError = true;
                }

                return {
                    id: accounting.id,
                    type: accounting.type,
                    date: formatDateToString(accounting.date),
                    category: accounting.category.name,
                    nature: accounting.nature.name,
                    secondNature: accounting.secondNature?.name || "-",
                    thirdNature: accounting.thirdNature?.name || "-",
                    description: accounting.description,
                    amount: accounting.amount,
                    amountType: accounting.isTTC ? "TTC" : "HT",
                    paymentMode: accounting.paymentMode,
                    checkNumber: accounting.checkNumber || "-",
                    unit: accounting.unit?.reference || "-",
                    allocation: accounting.allocation?.name || "-",
                    source: accounting.source.name,
                    period: accounting.period ? formatDateToString(accounting.period) : "-",
                    documents: documents.urls,
                };
            })
        );

        if (hasError) {
            server?.publish(
                "error",
                "Certaines images ou documents n'ont pas pu être chargés depuis le storage"
            );
        }

        return {
            data: accountingsWithSignedUrl,
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
        if (!canAccess(permission, "accounting", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const accounting = await prisma.accounting.findUnique({
            where: { id: params.id },
        });

        if (!accounting) {
            return status(404, { message: "Aucune opération comptable trouvée." });
        }

        const documents = await safeSignedUrls(accounting.documents);

        if (documents.error) {
            server?.publish("error",
                "Certaines images ou documents n'ont pas pu être chargés depuis le storage"
            );

        }
        return {
            ...accounting,
            documents: documents.urls
        };

    }, { auth: true, params: request.params })
    .post("/income", async ({ body, permission, status, user }) => {
        if (!canAccess(permission, "accounting", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = incomeAccountingSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations de l'opération comptable sont invalides." });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.accounting.create({
                data: {
                    date: data.date,
                    type: "INFLOW",
                    paymentMode: data.paymentMode,
                    amount: new Decimal(data.amount),
                    description: data.description,
                    sourceId: data.source,
                    ...(data.allocation && {
                        allocationId: data.allocation
                    }),
                    isTTC: data.taxType === "TTC",
                    categoryId: data.category,
                    natureId: data.nature,
                    ...(data.secondNature && {
                        secondNatureId: data.secondNature
                    }),
                    ...(data.thirdNature && {
                        thirdNatureId: data.thirdNature
                    }),
                    userId: user.id,
                    documents,
                },
            });

            return status(201, { message: "Opération comptable créé avec succès." });

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
                message: "Erreur lors de la création de l'opération comptable.",
            });
        }
    },
        {
            auth: true,
            body: request.incomeBody
        })
    .post("/outcome", async ({ body, permission, status, user }) => {
        if (!canAccess(permission, "accounting", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data, error } = outcomeAccountingSchema.safeParse(body);

            console.log(data);
            console.log(error);

            if (!success) {
                return status(400, { message: "Les informations de l'opération comptable sont invalides." });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.$transaction(async (tx) => {
                await tx.accounting.create({
                    data: {
                        date: data.date,
                        type: "OUTFLOW",
                        paymentMode: data.paymentMode,
                        amount: new Decimal(data.amount),
                        checkNumber: data.checkNumber,
                        period: data.period,
                        description: data.description,
                        sourceId: data.source,
                        ...(data.allocation && {
                            allocationId: data.allocation
                        }),
                        isTTC: data.taxType === "TTC",
                        categoryId: data.category,
                        natureId: data.nature,
                        ...(data.secondNature && {
                            secondNatureId: data.secondNature
                        }),
                        ...(data.thirdNature && {
                            thirdNatureId: data.thirdNature
                        }),
                        ...(data.unit && {
                            unitId: data.unit
                        }),
                        userId: user.id,
                        documents,
                    },
                });

                if (data.unit) {
                    await tx.unit.update({
                        where: {
                            id: data.unit
                        },
                        data: {
                            amountGenerate: {
                                increment: new Decimal(data.amount)
                            }
                        }
                    })
                }
            })

            return status(201, { message: "Opération comptable créé avec succès." });

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
                message: "Erreur lors de la création de l'opération comptable.",
            });
        }
    },
        {
            auth: true,
            body: request.outcomeBody
        })
    .put("/income/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "accounting", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const accounting = await prisma.accounting.findUnique({
            where: { id },
        });


        if (!accounting) {
            return status(404, { message: "Opération comptable non trouvé" });
        }

        const oldKeys = [...accounting.documents];

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = incomeAccountingSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations de l'opération comptable sont invalides." });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(JSON.stringify(error));
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.$transaction([
                prisma.accounting.update({
                    where: {
                        id: params.id
                    },
                    data: {
                        date: data.date,
                        type: "INFLOW",
                        paymentMode: data.paymentMode,
                        amount: new Decimal(data.amount),
                        description: data.description,
                        sourceId: data.source,
                        allocationId: data.allocation || null,
                        isTTC: data.taxType === "TTC",
                        categoryId: data.category,
                        natureId: data.nature,
                        secondNatureId: data.secondNature || null,
                        thirdNatureId: data.thirdNature || null,
                        documents,
                    },
                }),
            ])

            await Promise.all(
                oldKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );

            return status(201, { message: "Opération comptable modifié avec succès" });

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

            return status(500, {
                message: "Erreur lors de la modification de l'opération comptable",
            });
        }
    }, { auth: true, body: request.incomeBody, params: request.params })
    .put("/outcome/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "accounting", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const accounting = await prisma.accounting.findUnique({
            where: { id },
        });

        if (!accounting) {
            return status(404, { message: "Opération comptable non trouvée" });
        }

        const uploadedKeys: string[] = [];
        const oldKeys = [...accounting.documents];

        try {
            const { success, data } = outcomeAccountingSchema.safeParse(body);

            console.log(data);
            if (!success) {
                return status(400, {
                    message: "Les informations de l'opération comptable sont invalides."
                });
            }

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, {
                    message: "Erreur lors de l'upload des fichiers, veuillez réessayer"
                });
            }

            await prisma.$transaction(async (tx) => {
                await tx.accounting.update({
                    where: { id },
                    data: {
                        date: data.date,
                        type: "OUTFLOW",
                        paymentMode: data.paymentMode,
                        amount: new Decimal(data.amount),
                        checkNumber: data.checkNumber,
                        period: data.period,
                        description: data.description,
                        sourceId: data.source,

                        allocationId: data.allocation || null,

                        isTTC: data.taxType === "TTC",
                        categoryId: data.category,
                        natureId: data.nature,

                        secondNatureId: data.secondNature || null,
                        thirdNatureId: data.thirdNature || null,
                        unitId: data.unit || null,

                        documents,
                    },
                });

                if (data.unit) {
                    await prisma.$transaction(async (tx) => {
                        if (accounting.unitId) {
                            await tx.unit.update({
                                where: { id: accounting.unitId },
                                data: {
                                    amountGenerate: {
                                        decrement: new Decimal(accounting.amount),
                                    },
                                },
                            });
                        }
                        if (data.unit) {
                            await tx.unit.update({
                                where: { id: data.unit },
                                data: {
                                    amountGenerate: {
                                        increment: new Decimal(data.amount),
                                    },
                                },
                            });
                        }
                    });
                }
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

            return status(200, {
                message: "Opération comptable modifiée avec succès"
            });

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
                message: "Erreur lors de la modification de l'opération comptable",
            });
        }
    },
        {
            auth: true,
            body: request.outcomeBody,
            params: request.params
        })
    .delete("/:id", async ({ params, permission, user, status }) => {
        if (!canAccess(permission, "accounting", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;
        const accounting = await prisma.accounting.findUnique({
            where: { id },
        });

        if (!accounting) return status(400, { message: "Aucune opération comptable trouvée." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: accounting.id,
                    type: "ACCOUNTING",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.accounting.update({
                where: { id: accounting.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression de l'opération comptable est en attente de validation.` });
    }, { auth: true, params: request.params })

