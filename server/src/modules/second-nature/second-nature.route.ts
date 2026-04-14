import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { secondNatureSchema } from "../../lib/zod/acounting";

export const secondNatureRoutes = new Elysia({ prefix: "/second-nature" })
    .use(authPlugin)
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.secondNature.findMany({
            where: {
                natureId: query.nature,
                accountingType: query.accountingType,
            },
            orderBy: {
                name: "desc",
            }
        });

    }, { auth: true, query: t.Object({ nature: t.String({ error: "Aucune nature trouvée." }), accountingType: t.Enum({ INFLOW: "INFLOW", OUTFLOW: "OUTFLOW" }) }) })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.secondNature.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = secondNatureSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Seconde nature invalide" });
        }

        const alreadyExist = await prisma.secondNature.findFirst({
            where: {
                name: data.name,
                natureId: data.nature,
                accountingType: data.accountingType,
            }
        });

        if (alreadyExist) {
            return status(400, { message: "Une seconde nature avec ce nom existe déjà" });
        }


        await prisma.secondNature.create({
            data: {
                name: data.name,
                natureId: data.nature,
                accountingType: data.accountingType,
            }
        })

        return status(200, { message: "Seconde nature créée avec succès" });

    }, { auth: true, body: secondNatureSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = secondNatureSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Seconde nature invalide" });
        }

        const alreadyExist = await prisma.secondNature.findFirst({
            where: {
                name: data.name,
                natureId: data.nature,
                accountingType: data.accountingType,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Une Seconde nature avec ce nom et ce type existe déjà" });
        }

        await prisma.secondNature.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
                natureId: data.nature,
                accountingType: data.accountingType,
            }
        })

        return status(200, { message: "Seconde nature modifiée avec succès" });

    }, { auth: true, body: secondNatureSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.secondNature.delete({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })