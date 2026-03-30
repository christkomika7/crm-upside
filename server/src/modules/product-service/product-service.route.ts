import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import { productServiceSchema } from "../../lib/zod/product-service";
import { Prisma } from "../../generated/prisma/client";

export const productServiceRoutes = new Elysia({ prefix: "/product-service" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "productService", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const productServices = await prisma.productService.findMany({
            orderBy: { createdAt: "desc" },
        });

        return productServices;
    }, { auth: true })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "productService", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const productService = await prisma.productService.findUnique({
            where: { id: params.id },
        });

        if (!productService) {
            return status(404, { message: "Aucun service produit trouvé" });
        }

        return productService;
    }, { auth: true, params: request.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "productService", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const { data, success } = productServiceSchema.safeParse(body);

        if (!success) return status(400, { message: "Les données du produit ou service sont invalides." });

        try {
            const existing = await prisma.productService.findUnique({
                where: { reference: data.reference },
            });

            if (existing) {
                return status(409, { message: "Un service produit avec cette référence existe déjà" });
            }

            await prisma.productService.create({
                data: {
                    reference: body.reference,
                    description: body.description,
                    hasTax: body.hasTax,
                    price: body.price,
                },
            });

            return status(201, { message: "Service produit créé avec succès" });
        } catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return status(400, {
                        message: "Cette référence existe déjà"
                    });
                }
            }
            return status(500, { message: "Erreur lors de la création du service produit" });
        }
    }, { auth: true, body: request.body })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "productService", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const { data, success } = productServiceSchema.safeParse(body);

        if (!success) return status(400, { message: "Les données du produit ou service sont invalides." });

        const productService = await prisma.productService.findUnique({
            where: { id: params.id },
        });

        if (!productService) {
            return status(404, { message: "Service produit non trouvé" });
        }

        try {
            const existing = await prisma.productService.findFirst({
                where: {
                    reference: body.reference,
                    NOT: { id: params.id }
                },
            });

            if (existing) {
                return status(409, { message: "Un service produit avec cette référence existe déjà" });
            }

            await prisma.productService.update({
                where: { id: params.id },
                data: {
                    reference: body.reference,
                    description: body.description,
                    hasTax: body.hasTax,
                    price: body.price,
                },
            });

            return status(200, { message: "Service produit modifié avec succès" });
        } catch (error) {
            console.error(error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return status(400, {
                        message: "Cette référence existe déjà"
                    });
                }
            }
            return status(500, { message: "Erreur lors de la modification du service produit" });
        }
    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "productService", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const productService = await prisma.productService.findUnique({
            where: { id: params.id },
        });

        if (!productService) {
            return status(404, { message: "Aucun service produit trouvé" });
        }

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: productService.id,
                    type: "PRODUCT_SERVICE",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.productService.update({
                where: { id: productService.id },
                data: { isDeleting: true }
            })
        ]);

        return status(200, { message: `Le service ou produit  ${productService.reference} est en attente de suppression.` });
    }, { auth: true, params: request.params })