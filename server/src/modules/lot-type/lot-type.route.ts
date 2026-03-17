import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { lotTypeSchema } from "../../lib/zod/building";

export const lotTypeRoutes = new Elysia({ prefix: "/lot-type" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "buildings", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.lotType.findMany({
            orderBy: {
                name: "desc",
            }
        })

    }, { auth: true })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "buildings", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.lotType.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "buildings", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = lotTypeSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Lot type invalide" });
        }

        const alreadyExist = await prisma.lotType.findUnique({
            where: {
                name: data.name,
            }
        })

        if (alreadyExist) {
            return status(400, { message: "Lot type existe déjà" });
        }

        await prisma.lotType.create({
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Lot type crée avec succès" });

    }, { auth: true, body: lotTypeSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "buildings", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = lotTypeSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Lot type invalide" });
        }

        const alreadyExist = await prisma.lotType.findFirst({
            where: {
                name: data.name,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Lot type existe déjà" });
        }

        await prisma.lotType.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Lot type modifié avec succès" });

    }, { auth: true, body: lotTypeSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "buildings", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.lotType.delete({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })