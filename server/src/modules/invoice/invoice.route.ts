import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import Decimal from "decimal.js";
import { invoiceSchema } from "../../lib/zod/invoices";
import { formatDateToString, generateRef } from "../../lib/utils";
import { $Enums } from "../../generated/prisma/client";

export const invoiceRoutes = new Elysia({ prefix: "/invoice" })
    .use(authPlugin)
    .get("/stats", async ({ permission, status }) => {
        if (!canAccess(permission, "invoicing", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const invoices = await prisma.invoice.findMany({
            where: { isDeleting: false },
            select: {
                price: true,
                amountPaid: true,
                status: true,
            }
        })

        const stats = invoices.reduce(
            (acc, invoice) => {
                const price = invoice.price.toNumber()
                const amountPaid = invoice.amountPaid.toNumber()
                const due = price - amountPaid

                acc.total += price
                acc.paid += amountPaid
                acc.unpaid += invoice.status !== "PAID" ? price : 0
                acc.due += due > 0 ? due : 0

                return acc
            },
            { total: 0, paid: 0, unpaid: 0, due: 0 }
        )

        return {
            total: stats.total,
            paid: stats.paid,
            unpaid: stats.unpaid,
            due: stats.due,
            count: {
                total: invoices.length,
                paid: invoices.filter(i => i.status === "PAID").length,
                pending: invoices.filter(i => i.status === "PENDING").length,
                overdue: invoices.filter(i => i.status === "OVERDUE").length,
            }
        }
    }, { auth: true })
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "invoicing", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const whereClause =
            query.type === "PAID"
                ? { status: $Enums.InvoiceStatus.PAID }
                : query.type === "UNPAID"
                    ? { NOT: { status: $Enums.InvoiceStatus.PAID } }
                    : {};

        const [invoices, reference] = await prisma.$transaction([
            prisma.invoice.findMany({
                where: whereClause,
                include: {
                    owner: true,
                    tenant: true
                }
            }),
            prisma.reference.findFirst(),
        ]);

        return invoices.map((invoice) => ({
            id: invoice.id,
            reference: generateRef(reference?.invoice, invoice.reference),
            type: invoice.type,
            issue: formatDateToString(invoice.start),
            isDeleting: invoice.isDeleting,
            client:
                invoice.type === "OWNER"
                    ? `${invoice.owner?.firstname} ${invoice.owner?.lastname}`
                    : `${invoice.tenant?.firstname} ${invoice.tenant?.lastname}`,
            amount: invoice.price.toString(),
            amountPaid: invoice.amountPaid.toString(),
            status: invoice.status,
            due: formatDateToString(invoice.end),
        }));
    }, { auth: true, query: request.queryType })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "invoicing", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const [invoice, reference] = await prisma.$transaction([
            prisma.invoice.findUnique({
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
            ...invoice,
            reference: generateRef(reference?.invoice, invoice?.reference),
        }
    }, { auth: true, params: request.paramsId })
    .get("/duplicate/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "invoicing", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) return status(400, { message: "L'identifiant est requis" });

        const invoice = await prisma.invoice.findUnique({
            where: {
                id: params.id
            },
            include: {
                items: true,
                owner: true,
                tenant: true
            }
        });

        if (!invoice) return status(404, { message: "Facture non trouvée" });
        if (invoice.isDeleting) return status(400, { message: "Impossible de dupliquer une facture en cours de suppression" });


        try {
            const newInvoice = await prisma.invoice.create({
                data: {
                    price: new Decimal(invoice.price),
                    discount: new Decimal(invoice.discount || 0),
                    discountType: invoice.discountType,
                    hasTax: invoice.hasTax,
                    type: invoice.type,
                    start: invoice.start,
                    end: invoice.end,
                    note: invoice.note,
                    ...(invoice.type === "OWNER" ? { ownerId: invoice.ownerId } : { tenantId: invoice.tenantId }),
                    items: {
                        createMany: {
                            data: invoice.items.map((item) => ({
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

            switch (newInvoice.type) {
                case "OWNER":
                    await prisma.owner.update({
                        where: {
                            id: newInvoice.ownerId!
                        },
                        data: {
                            invoices: {
                                connect: {
                                    id: newInvoice.id
                                }
                            }
                        }
                    })
                    break;
                case "TENANT":
                    await prisma.tenant.update({
                        where: {
                            id: newInvoice.tenantId!
                        },
                        data: {
                            invoices: {
                                connect: {
                                    id: newInvoice.id
                                }
                            }
                        }
                    })
                    break;
            }
            return status(201, { message: "Facture dupliquée avec succès" })
        } catch (error) {
            console.error(error);
            return status(500, { message: "Erreur lors de la duplication de la facture" })
        }



    }, { auth: true, params: request.paramsId })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "invoicing", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }
        try {
            const { success, data } = invoiceSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Facture invalide" });
            }

            const invoice = await prisma.invoice.create({
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
                            invoices: {
                                connect: {
                                    id: invoice.id
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
                            invoices: {
                                connect: {
                                    id: invoice.id
                                }
                            }
                        }
                    })
                    break;
            }

            return status(201, { message: "Facture créée avec succès" })
        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la création de la facture",
            });
        }
    }, { auth: true, body: request.body })
    .put("/:id", async ({ body, permission, status, params }) => {
        if (!canAccess(permission, "invoicing", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const invoice = await prisma.invoice.findUnique({
                where: {
                    id: params.id
                }
            })

            if (!invoice) {
                return status(404, { message: "Facture non trouvée" });
            }

            if (invoice.isDeleting) {
                return status(400, { message: "Facture en cours de suppression" });
            }

            const { success, data } = invoiceSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Facture invalide" });
            }

            await prisma.$transaction(async tx => {
                await tx.item.deleteMany({
                    where: { invoiceId: params.id }
                })


                await tx.invoice.update({
                    where: { id: params.id },
                    data: { ownerId: null, tenantId: null }
                })

                console.log(invoice)
                console.log(data)

                await tx.invoice.update({
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
                                    hasTax: item.hasTax,
                                    reference: item.reference
                                })),
                            }
                        },
                    },
                });
            })

            return status(200, { message: "Facture mise à jour avec succès" })

        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la création de la facture",
            });
        }
    }, { auth: true, body: request.body, params: request.paramsId })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "invoicing", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const [invoice, reference] = await prisma.$transaction([
            prisma.invoice.findUnique({ where: { id } }),
            prisma.reference.findFirst()
        ])

        if (!invoice) return status(404, { message: "Facture non trouvée" });
        if (invoice.isDeleting) return status(400, { message: "Facture en cours de suppression" });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: invoice.id,
                    type: "INVOICING",
                    state: "WAIT",
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }),
            prisma.invoice.update({
                where: { id: invoice.id },
                data: { isDeleting: true }
            })
        ]);
        return status(200, { message: `La suppression de la facture ${generateRef(reference?.invoice, invoice.reference)} est en attente de validation.` })
    }, { auth: true, params: request.paramsId })