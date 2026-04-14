import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { categorySchema } from "../../lib/zod/acounting";

export const categoryRoutes = new Elysia({ prefix: "/category" })
    .use(authPlugin)
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.category.findMany({
            where: {
                accountingType: query.accountingType,
            },
            orderBy: {
                name: "desc",
            }
        })

    }, { auth: true, query: t.Object({ accountingType: t.Enum({ INFLOW: "INFLOW", OUTFLOW: "OUTFLOW" }) }) })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.category.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = categorySchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Catégorie invalide" });
        }

        const alreadyExist = await prisma.category.findFirst({
            where: {
                name: data.name,
                accountingType: data.accountingType,
            }
        })

        if (alreadyExist) {
            return status(400, { message: "Catégorie existe déjà" });
        }

        await prisma.category.create({
            data: {
                name: data.name,
                accountingType: data.accountingType,
            }
        })

        return status(200, { message: "Catégorie créée avec succès" });

    }, { auth: true, body: categorySchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = categorySchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Catégorie invalide" });
        }

        const alreadyExist = await prisma.category.findFirst({
            where: {
                name: data.name,
                accountingType: data.accountingType,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Catégorie existe déjà" });
        }

        await prisma.category.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
                accountingType: data.accountingType,
            }
        })

        return status(200, { message: "Catégorie modifié avec succès" });

    }, { auth: true, body: categorySchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.category.delete({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })