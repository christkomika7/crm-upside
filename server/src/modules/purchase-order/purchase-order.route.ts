import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import Decimal from "decimal.js";
import { purchaseOrderSchema } from "../../lib/zod/purchase-order";
import { formatDateToString, generateRef } from "../../lib/utils";
import { $Enums } from "../../generated/prisma/client";

export const purchaseOrderRoutes = new Elysia({ prefix: "/purchase-order" })
    .use(authPlugin)
    .get("/stats", async ({ permission, status }) => {
        if (!canAccess(permission, "purchaseOrders", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const purchaseOrders = await prisma.purchaseOrder.findMany({
            select: {
                price: true,
                amountPaid: true,
                status: true,
            }
        })

        const stats = purchaseOrders.reduce(
            (acc, purchaseOrder) => {
                const price = purchaseOrder.price.toNumber()
                const amountPaid = purchaseOrder.amountPaid.toNumber()
                const due = price - amountPaid

                acc.total += price
                acc.paid += amountPaid
                acc.unpaid += purchaseOrder.status !== "PAID" ? price : 0
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
                total: purchaseOrders.length,
                paid: purchaseOrders.filter(i => i.status === "PAID").length,
                pending: purchaseOrders.filter(i => i.status === "PENDING").length,
                overdue: purchaseOrders.filter(i => i.status === "OVERDUE").length,
            }
        }
    }, { auth: true })
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "purchaseOrders", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const whereClause =
            query.type === "PAID"
                ? { status: $Enums.RecordStatus.PAID }
                : query.type === "UNPAID"
                    ? { NOT: { status: $Enums.RecordStatus.PAID } }
                    : {};

        const [purchaseOrders, reference] = await prisma.$transaction([
            prisma.purchaseOrder.findMany({
                where: whereClause,
                include: {
                    serviceProvider: true
                }
            }),
            prisma.reference.findFirst(),
        ]);

        return purchaseOrders.map((purchaseOrder) => ({
            id: purchaseOrder.id,
            reference: generateRef(reference?.purchaseOrder, purchaseOrder.reference),
            issue: formatDateToString(purchaseOrder.start),
            isDeleting: purchaseOrder.isDeleting,
            serviceProvider: `${purchaseOrder.serviceProvider?.firstname} ${purchaseOrder.serviceProvider?.lastname}`,
            amount: purchaseOrder.price.toString(),
            amountPaid: purchaseOrder.amountPaid.toString(),
            status: purchaseOrder.status,
            due: formatDateToString(purchaseOrder.end),
        }));
    }, { auth: true, query: request.queryType })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "purchaseOrders", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const [purchaseOrder, reference] = await prisma.$transaction([
            prisma.purchaseOrder.findUnique({
                where: {
                    id: params.id
                },
                include: {
                    items: true,
                    serviceProvider: true
                }
            }),
            prisma.reference.findFirst(),
        ]);

        return {
            ...purchaseOrder,
            reference: generateRef(reference?.purchaseOrder, purchaseOrder?.reference),
        }
    }, { auth: true, params: request.paramsId })
    .get("/service-provider", async ({ permission, status }) => {
        if (!canAccess(permission, "purchaseOrders", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.serviceProvider.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true
            }
        });

    }, { auth: true })
    .get("/duplicate/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "purchaseOrders", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) return status(400, { message: "L'identifiant est requis" });

        const purchaseOrder = await prisma.purchaseOrder.findUnique({
            where: {
                id: params.id
            },
            include: {
                items: true,
                serviceProvider: true
            }
        });

        if (!purchaseOrder) return status(404, { message: "Bon de commande non trouvé" });
        if (purchaseOrder.isDeleting) return status(400, { message: "Impossible de dupliquer un bon de commande en cours de suppression" });


        try {
            const newPurchaseOrder = await prisma.purchaseOrder.create({
                data: {
                    price: new Decimal(purchaseOrder.price),
                    discount: new Decimal(purchaseOrder.discount || 0),
                    discountType: purchaseOrder.discountType,
                    hasTax: purchaseOrder.hasTax,
                    start: purchaseOrder.start,
                    end: purchaseOrder.end,
                    note: purchaseOrder.note,
                    serviceProviderId: purchaseOrder.serviceProviderId,
                    items: {
                        createMany: {
                            data: purchaseOrder.items.map((item) => ({
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

            await prisma.serviceProvider.update({
                where: {
                    id: newPurchaseOrder.serviceProviderId!
                },
                data: {
                    purchaseOrders: {
                        connect: {
                            id: newPurchaseOrder.id
                        }
                    }
                }
            })

            return status(201, { message: "Bon de commande dupliquée avec succès" })
        } catch (error) {
            console.error(error);
            return status(500, { message: "Erreur lors de la duplication du bon de commande" })
        }



    }, { auth: true, params: request.paramsId })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "purchaseOrders", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }
        try {
            const { success, data } = purchaseOrderSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Bon de commande invalide" });
            }

            const purchaseOrder = await prisma.purchaseOrder.create({
                data: {
                    price: new Decimal(data.price),
                    discount: new Decimal(data.discount || 0),
                    discountType: data.discountType,
                    hasTax: data.hasTax,
                    start: data.start,
                    end: data.end,
                    note: data.note,
                    serviceProviderId: data.serviceProvider,
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

            await prisma.serviceProvider.update({
                where: {
                    id: data.serviceProvider
                },
                data: {
                    purchaseOrders: {
                        connect: {
                            id: purchaseOrder.id
                        }
                    }
                }
            })

            return status(201, { message: "Bon de commande créée avec succès" })
        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la création du bon de commande",
            });
        }
    }, { auth: true, body: request.body })
    .put("/:id", async ({ body, permission, status, params }) => {
        if (!canAccess(permission, "purchaseOrders", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const purchaseOrder = await prisma.purchaseOrder.findUnique({
                where: {
                    id: params.id
                }
            })

            if (!purchaseOrder) {
                return status(404, { message: "Bon de commande non trouvé" });
            }

            if (purchaseOrder.isDeleting) {
                return status(400, { message: "Bon de commande en cours de suppression" });
            }

            const { success, data } = purchaseOrderSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Bon de commande invalide" });
            }

            await prisma.$transaction(async tx => {
                await tx.item.deleteMany({
                    where: { purchaseOrderId: params.id }
                })


                await tx.purchaseOrder.update({
                    where: { id: params.id },
                    data: { serviceProviderId: undefined }
                })

                await tx.purchaseOrder.update({
                    where: {
                        id: params.id
                    },
                    data: {
                        price: new Decimal(data.price),
                        discount: new Decimal(data.discount || 0),
                        discountType: data.discountType,
                        hasTax: data.hasTax,
                        start: data.start,
                        end: data.end,
                        note: data.note,
                        serviceProviderId: data.serviceProvider,
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

            return status(200, { message: "Bon de commande mise à jour avec succès" })

        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la mise à jour du bon de commande",
            });
        }
    }, { auth: true, body: request.body, params: request.paramsId })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "purchaseOrders", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const [purchaseOrder, reference] = await prisma.$transaction([
            prisma.purchaseOrder.findUnique({ where: { id } }),
            prisma.reference.findFirst()
        ])

        if (!purchaseOrder) return status(404, { message: "Bon de commande non trouvé" });
        if (purchaseOrder.isDeleting) return status(400, { message: "Bon de commande en cours de suppression" });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: purchaseOrder.id,
                    type: "PURCHASE_ORDER",
                    state: "WAIT",
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }),
            prisma.purchaseOrder.update({
                where: { id: purchaseOrder.id },
                data: { isDeleting: true }
            })
        ]);
        return status(200, { message: `La suppression du bon de commande ${generateRef(reference?.purchaseOrder, purchaseOrder.reference)} est en attente de validation.` })
    }, { auth: true, params: request.paramsId })