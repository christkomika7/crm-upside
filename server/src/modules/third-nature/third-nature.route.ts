import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { thirdNatureSchema } from "../../lib/zod/acounting";

export const thirdNatureRoutes = new Elysia({ prefix: "/third-nature" })
    .use(authPlugin)
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.thirdNature.findMany({
            where: {
                secondNatureId: query.secondNature,
                accountingType: query.accountingType,
            },
            orderBy: {
                name: "desc",
            }
        })

    }, { auth: true, query: t.Object({ secondNature: t.String({ error: "Aucune seconde nature trouvée." }), accountingType: t.Enum({ INFLOW: "INFLOW", OUTFLOW: "OUTFLOW" }) }) })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.thirdNature.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = thirdNatureSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Troisième nature invalide" });
        }

        const alreadyExist = await prisma.thirdNature.findFirst({
            where: {
                name: data.name,
                secondNatureId: data.secondNature,
                accountingType: data.accountingType,
            }
        });

        if (alreadyExist) {
            return status(400, { message: "Une troisième nature avec ce nom existe déjà" });
        }


        await prisma.thirdNature.create({
            data: {
                name: data.name,
                secondNatureId: data.secondNature,
                accountingType: data.accountingType,
            }
        })

        return status(200, { message: "Troisième nature créée avec succès" });

    }, { auth: true, body: thirdNatureSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = thirdNatureSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Troisième nature invalide" });
        }

        const alreadyExist = await prisma.thirdNature.findFirst({
            where: {
                name: data.name,
                secondNatureId: data.secondNature,
                accountingType: data.accountingType,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Une troisième nature avec ce nom et ce type existe déjà" });
        }

        await prisma.thirdNature.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
                secondNatureId: data.secondNature,
                accountingType: data.accountingType,
            }
        })

        return status(200, { message: "Troisième nature modifiée avec succès" });

    }, { auth: true, body: thirdNatureSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "accounting", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.thirdNature.delete({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })