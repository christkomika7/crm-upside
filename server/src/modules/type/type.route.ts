import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { typeSchema } from "../../lib/zod/units";

export const typeRoutes = new Elysia({ prefix: "/type" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "units", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.type.findMany({
            orderBy: {
                name: "desc",
            }
        })

    }, { auth: true })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "units", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.type.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "units", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = typeSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Type invalide" });
        }

        const alreadyExist = await prisma.type.findUnique({
            where: {
                name: data.name,
            }
        })

        if (alreadyExist) {
            return status(400, { message: "Type existe déjà" });
        }

        await prisma.type.create({
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Type créé avec succès" });

    }, { auth: true, body: typeSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "units", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = typeSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Type invalide" });
        }

        const alreadyExist = await prisma.type.findFirst({
            where: {
                name: data.name,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Type existe déjà" });
        }

        await prisma.type.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Type modifié avec succès" });

    }, { auth: true, body: typeSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "units", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.type.delete({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })