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

        console.log({ sort })

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
            const { success, data } = outcomeAccountingSchema.safeParse(body);

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
            body: request.incomeBody
        })
// .put("/:id", async ({ params, body, permission, status }) => {
//     if (!canAccess(permission, "owners", "update")) {
//         return status(403, { message: "Accès refusé" });
//     }

//     const id = params.id;

//     const owner = await prisma.owner.findUnique({
//         where: { id },
//     });


//     if (!owner) {
//         return status(404, { message: "Propriétaire non trouvé" });
//     }

//     const oldKeys = [...owner.documents];

//     const uploadedKeys: string[] = [];

//     try {
//         const { success, data } = ownerSchema.safeParse(body);

//         if (!success) {
//             return status(400, { message: "Les informations du propriétaire sont invalide" });
//         }

//         const existingOwner = await prisma.owner.findFirst({
//             where: {
//                 reference: data.reference,
//                 NOT: { id: params.id }
//             }
//         });

//         if (existingOwner) {
//             return status(400, {
//                 message: `La référence ${data.reference} est déjà utilisée.`
//             });
//         }


//         let documents: string[] = [];

//         try {
//             documents = await uploadFiles(uploadedKeys, data.documents);
//         } catch (error) {
//             console.error(JSON.stringify(error));
//             return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
//         }

//         await prisma.owner.update({
//             where: {
//                 id: params.id
//             },
//             data: {
//                 reference: data.reference,
//                 firstname: data.firstname,
//                 lastname: data.lastname,
//                 company: data.company,
//                 phone: data.phone,
//                 email: data.email,
//                 address: data.address,
//                 actionnary: data.actionnary,
//                 bankInfo: data.bankInfo,
//                 documents,
//                 buildings: {
//                     set: data.buildings.map((building) => ({ id: building })),
//                 }
//             },
//         });

//         await Promise.all(
//             oldKeys.map(async (key) => {
//                 try {
//                     await deleteFile(key);
//                 } catch (e) {
//                     console.error("Erreur suppression fichier:", key, e);
//                 }
//             })
//         );

//         return status(201, { message: "Propriétaire modifié avec succès" });

//     } catch (error) {

//         await Promise.all(
//             uploadedKeys.map(async (key) => {
//                 try {
//                     await deleteFile(key);
//                 } catch (e) {
//                     console.error("Erreur suppression fichier:", key, e);
//                 }
//             })
//         );

//         if (error instanceof Prisma.PrismaClientKnownRequestError) {
//             if (error.code === "P2002") {
//                 return status(400, {
//                     message: "Cette référence existe déjà"
//                 });
//             }
//         }

//         return status(500, {
//             message: "Erreur lors de la modification du propriétaire",
//         });
//     }
// }, { auth: true, body: request.body, params: request.params })
// .delete("/:id", async ({ params, permission, user, status }) => {
//     if (!canAccess(permission, "owners", "update")) {
//         return status(403, { message: "Accès refusé" });
//     }

//     const id = params.id;
//     const owner = await prisma.owner.findUnique({
//         where: { id },
//     });

//     if (!owner) return status(400, { message: "Aucun propriétaire trouvé." });

//     await prisma.$transaction([
//         prisma.deletion.create({
//             data: {
//                 recordId: owner.id,
//                 type: "OWNER",
//                 state: "WAIT",
//                 user: {
//                     connect: { id: user.id }
//                 }
//             }
//         }),
//         prisma.owner.update({
//             where: { id: owner.id },
//             data: {
//                 isDeleting: true
//             }
//         })
//     ]);

//     return status(200, { message: `La suppression du propriétaire ${owner.firstname} ${owner.lastname} est en attente de validation.` });
// }, { auth: true, params: request.params })

