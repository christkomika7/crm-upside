import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { sourceSchema } from "../../lib/zod/acounting";

export const sourceRoutes = new Elysia({ prefix: "/source" })
    .use(authPlugin)
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.source.findMany({
            where: {
                type: query.paymentMethod,
            },
            orderBy: {
                name: "desc",
            }
        })

    }, { auth: true, query: t.Object({ paymentMethod: t.Enum({ CASH: "CASH", CHECK: "CHECK", BANK: "BANK" }, { error: "Aucune méthode de paiement trouvée." }) }) })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.source.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = sourceSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Source invalide" });
        }

        const alreadyExist = await prisma.source.findFirst({
            where: {
                name: data.name,
                type: data.paymentMethod,
            }
        });

        if (alreadyExist) {
            return status(400, { message: "Une source avec ce nom et ce type existe déjà" });
        }


        await prisma.source.create({
            data: {
                name: data.name,
                type: data.paymentMethod
            }
        })

        return status(200, { message: "Source créée avec succès" });

    }, { auth: true, body: sourceSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = sourceSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Source invalide" });
        }

        const alreadyExist = await prisma.source.findFirst({
            where: {
                name: data.name,
                type: data.paymentMethod,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Une source avec ce nom et ce type existe déjà" });
        }

        await prisma.source.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
                type: data.paymentMethod
            }
        })

        return status(200, { message: "Source modifié avec succès" });

    }, { auth: true, body: sourceSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.source.delete({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })