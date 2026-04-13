import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { natureSchema } from "../../lib/zod/acounting";

export const natureRoutes = new Elysia({ prefix: "/nature" })
    .use(authPlugin)
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.nature.findMany({
            where: {
                categoryId: query.category
            },
            orderBy: {
                name: "desc",
            }
        });

    }, { auth: true, query: t.Object({ category: t.String({ error: "Aucune catégorie trouvée." }) }) })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.nature.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = natureSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Nature invalide" });
        }

        const alreadyExist = await prisma.nature.findFirst({
            where: {
                name: data.name,
                categoryId: data.category
            }
        });

        if (alreadyExist) {
            return status(400, { message: "Une nature avec ce nom existe déjà" });
        }


        await prisma.nature.create({
            data: {
                name: data.name,
                categoryId: data.category
            }
        })

        return status(200, { message: "Nature créée avec succès" });

    }, { auth: true, body: natureSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = natureSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Nature invalide" });
        }

        const alreadyExist = await prisma.nature.findFirst({
            where: {
                name: data.name,
                categoryId: data.category,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Une nature avec ce nom et ce type existe déjà" });
        }

        await prisma.nature.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
                categoryId: data.category
            }
        })

        return status(200, { message: "Nature modifiée avec succès" });

    }, { auth: true, body: natureSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.nature.delete({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })