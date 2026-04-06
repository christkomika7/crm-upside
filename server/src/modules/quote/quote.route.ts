import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import Decimal from "decimal.js";
import { formatDateToString, generateRef } from "../../lib/utils";
import { quoteSchema } from "../../lib/zod/quotes";

export const quoteRoutes = new Elysia({ prefix: "/quote" })
    .use(authPlugin)
    .get("/stats", async ({ permission, status }) => {
        if (!canAccess(permission, "quotes", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const quote = await prisma.quote.findMany({
            where: { isDeleting: false },
            select: {
                price: true,
                isComplete: true
            }
        })

        const stats = quote.reduce(
            (acc, quote) => {
                const price = quote.price.toNumber()

                acc.total += price
                acc.complete += quote.isComplete ? price : 0
                acc.wait += !quote.isComplete ? price : 0
                return acc
            },
            { total: 0, complete: 0, wait: 0 }
        )

        return {
            total: stats.total,
            complete: stats.complete,
            wait: stats.wait,
            count: {
                total: quote.length,
                complete: quote.filter(i => i.isComplete).length,
                wait: quote.filter(i => !i.isComplete).length,
            }
        }
    }, { auth: true })
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "quotes", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const whereClause =
            query.type === "COMPLETE"
                ? { isComplete: true }
                : query.type === "WAIT"
                    ? { isComplete: false }
                    : {};

        const [quotes, reference] = await prisma.$transaction([
            prisma.quote.findMany({
                where: whereClause,
                include: {
                    owner: true,
                    tenant: true
                }
            }),
            prisma.reference.findFirst(),
        ]);

        return quotes.map((quote) => ({
            id: quote.id,
            reference: generateRef(reference?.quote, quote.reference),
            type: quote.type,
            issue: formatDateToString(quote.start),
            isDeleting: quote.isDeleting,
            client:
                quote.type === "OWNER"
                    ? `${quote.owner?.firstname} ${quote.owner?.lastname}`
                    : `${quote.tenant?.firstname} ${quote.tenant?.lastname}`,
            amount: quote.price.toString(),
            due: formatDateToString(quote.end),
        }));
    }, { auth: true, query: request.queryType })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "quotes", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const [quote, reference] = await prisma.$transaction([
            prisma.quote.findUnique({
                where: {
                    id: params.id
                },
                include: {
                    items: true,
                    owner: true,
                    tenant: true
                }
            }),
            prisma.reference.findFirst(),
        ]);

        return {
            ...quote,
            reference: generateRef(reference?.quote, quote?.reference),
        }
    }, { auth: true, params: request.paramsId })
    .get("/duplicate/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "quotes", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) return status(400, { message: "L'identifiant est requis" });

        const quote = await prisma.quote.findUnique({
            where: {
                id: params.id
            },
            include: {
                items: true,
                owner: true,
                tenant: true
            }
        });

        if (!quote) return status(404, { message: "Devis non trouvée." });
        if (quote.isDeleting) return status(400, { message: "Impossible de dupliquer un devis en cours de suppression." });

        try {

            await prisma.$transaction(async tx => {
                const newQuote = await tx.quote.create({
                    data: {
                        price: new Decimal(quote.price),
                        discount: new Decimal(quote.discount || 0),
                        discountType: quote.discountType,
                        hasTax: quote.hasTax,
                        type: quote.type,
                        start: quote.start,
                        end: quote.end,
                        note: quote.note,
                        ...(quote.type === "OWNER" ? { ownerId: quote.ownerId } : { tenantId: quote.tenantId }),
                        items: {
                            createMany: {
                                data: quote.items.map((item) => ({
                                    productServiceId: item.productServiceId,
                                    quantity: item.quantity,
                                    price: new Decimal(item.price),
                                    description: item.description,
                                    hasTax: item.hasTax,
                                    reference: item.reference
                                })),
                            }
                        },
                    },
                });

                switch (newQuote.type) {
                    case "OWNER":
                        await tx.owner.update({
                            where: {
                                id: newQuote.ownerId!
                            },
                            data: {
                                quotes: {
                                    connect: {
                                        id: newQuote.id
                                    }
                                }
                            }
                        })
                        break;
                    case "TENANT":
                        await tx.tenant.update({
                            where: {
                                id: newQuote.tenantId!
                            },
                            data: {
                                quotes: {
                                    connect: {
                                        id: newQuote.id
                                    }
                                }
                            }
                        })
                        break;
                }

            })

            return status(201, { message: "Devis dupliqué avec succès." })
        } catch (error) {
            console.log(error);
            return status(500, { message: "Erreur lors de la duplication du devis." })

        }

    }, { auth: true, params: request.paramsId })
    .get("/convert/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "quotes", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) return status(400, { message: "L'identifiant est requis" });

        const quote = await prisma.quote.findUnique({
            where: {
                id: params.id
            },
            include: {
                items: true,
                owner: true,
                tenant: true
            }
        });

        if (!quote) return status(404, { message: "Devis non trouvée." });
        if (quote.isDeleting) return status(400, { message: "Impossible de dupliquer un devis en cours de suppression." });

        try {
            await prisma.$transaction(async tx => {
                const invoice = await tx.invoice.create({
                    data: {
                        price: new Decimal(quote.price),
                        discount: new Decimal(quote.discount || 0),
                        discountType: quote.discountType,
                        hasTax: quote.hasTax,
                        type: quote.type,
                        start: quote.start,
                        end: quote.end,
                        note: quote.note,
                        ...(quote.type === "OWNER" ? { ownerId: quote.ownerId } : { tenantId: quote.tenantId }),
                        items: {
                            createMany: {
                                data: quote.items.map((item) => ({
                                    productServiceId: item.productServiceId,
                                    quantity: item.quantity,
                                    price: new Decimal(item.price),
                                    description: item.description,
                                    hasTax: item.hasTax,
                                    reference: item.reference
                                })),
                            }
                        },
                    },
                });

                switch (invoice.type) {
                    case "OWNER":
                        await tx.owner.update({
                            where: {
                                id: invoice.ownerId!
                            },
                            data: {
                                invoices: {
                                    connect: {
                                        id: invoice.id
                                    }
                                }
                            }
                        })
                        break;
                    case "TENANT":
                        await tx.tenant.update({
                            where: {
                                id: invoice.tenantId!
                            },
                            data: {
                                invoices: {
                                    connect: {
                                        id: invoice.id
                                    }
                                }
                            }
                        })
                        break;
                }

                await tx.quote.update({
                    where: { id: params.id },
                    data: {
                        isComplete: true
                    }
                });

            });
            return status(201, { message: "Devis convertis en facture avec succès." })
        }
        catch (error) {
            console.log(error);
            return status(500, { message: "Erreur lors de la convertion du devis en facture." });
        }


    }, { auth: true, params: request.paramsId })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "quotes", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }
        try {
            const { success, data } = quoteSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Devis invalide" });
            }

            const quote = await prisma.quote.create({
                data: {
                    price: new Decimal(data.price),
                    discount: new Decimal(data.discount || 0),
                    discountType: data.discountType,
                    hasTax: data.hasTax,
                    type: data.type,
                    start: data.start,
                    end: data.end,
                    note: data.note,
                    ...(data.type === "OWNER" ? { ownerId: data.client } : { tenantId: data.client }),
                    items: {
                        createMany: {
                            data: data.items.map((item) => ({
                                productServiceId: item.id,
                                quantity: item.quantity,
                                price: new Decimal(item.price),
                                description: item.description,
                                status: "IGNORE",
                                hasTax: item.hasTax,
                                reference: item.reference
                            })),
                        }
                    },
                },
            });

            switch (data.type) {
                case "OWNER":
                    await prisma.owner.update({
                        where: {
                            id: data.client
                        },
                        data: {
                            quotes: {
                                connect: {
                                    id: quote.id
                                }
                            }
                        }
                    })
                    break;
                case "TENANT":
                    await prisma.tenant.update({
                        where: {
                            id: data.client
                        },
                        data: {
                            quotes: {
                                connect: {
                                    id: quote.id
                                }
                            }
                        }
                    })
                    break;
            }

            return status(201, { message: "Devis créé avec succès." })
        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la création du devis.",
            });
        }
    }, { auth: true, body: request.body })
    .put("/:id", async ({ body, permission, status, params }) => {
        if (!canAccess(permission, "quotes", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const quote = await prisma.quote.findUnique({
                where: {
                    id: params.id
                }
            })

            if (!quote) {
                return status(404, { message: "Devis non trouvé." });
            }

            if (quote.isDeleting) {
                return status(400, { message: "Devis en cours de suppression." });
            }

            const { success, data } = quoteSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Devis invalide." });
            }

            await prisma.$transaction(async tx => {
                await tx.item.deleteMany({
                    where: { quoteId: params.id }
                })


                await tx.quote.update({
                    where: { id: params.id },
                    data: { ownerId: null, tenantId: null }
                })

                await tx.quote.update({
                    where: {
                        id: params.id
                    },
                    data: {
                        price: new Decimal(data.price),
                        discount: new Decimal(data.discount || 0),
                        discountType: data.discountType,
                        hasTax: data.hasTax,
                        type: data.type,
                        start: data.start,
                        end: data.end,
                        note: data.note,
                        ...(data.type === "OWNER" ? { ownerId: data.client } : { tenantId: data.client }),
                        items: {
                            createMany: {
                                data: data.items.map((item) => ({
                                    productServiceId: item.id,
                                    quantity: item.quantity,
                                    price: new Decimal(item.price),
                                    description: item.description,
                                    status: "IGNORE",
                                    hasTax: item.hasTax,
                                    reference: item.reference
                                })),
                            }
                        },
                    },
                });
            })

            return status(200, { message: "Devis mis à jour avec succès." })

        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la modification du devis.",
            });
        }
    }, { auth: true, body: request.body, params: request.paramsId })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "quotes", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const [quote, reference] = await prisma.$transaction([
            prisma.quote.findUnique({ where: { id } }),
            prisma.reference.findFirst()
        ])

        if (!quote) return status(404, { message: "Devis non trouvé." });
        if (quote.isDeleting) return status(400, { message: "Devis en cours de suppression." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: quote.id,
                    type: 'QUOTE',
                    state: "WAIT",
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }),
            prisma.quote.update({
                where: { id: quote.id },
                data: { isDeleting: true }
            })
        ]);
        return status(200, { message: `La suppression du devis ${generateRef(reference?.quote, quote.reference)} est en attente de validation.` })
    }, { auth: true, params: request.paramsId })