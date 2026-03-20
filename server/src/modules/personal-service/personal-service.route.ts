import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { personalServiceSchema } from "../../lib/zod/property-management";

export const personalServiceRoutes = new Elysia({ prefix: "personal-service" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "propertyManagement", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.personalService.findMany({
            orderBy: {
                name: "desc",
            }
        })

    }, { auth: true })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "propertyManagement", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.personalService.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "propertyManagement", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = personalServiceSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Service personnel invalide" });
        }

        const alreadyExist = await prisma.personalService.findUnique({
            where: {
                name: data.name,
            }
        })

        if (alreadyExist) {
            return status(400, { message: "Service personnel existe déjà" });
        }

        await prisma.personalService.create({
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Service personnel crée avec succès" });

    }, { auth: true, body: personalServiceSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "propertyManagement", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = personalServiceSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Service personnel invalide" });
        }

        const alreadyExist = await prisma.personalService.findFirst({
            where: {
                name: data.name,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Service personnel existe déjà" });
        }

        await prisma.personalService.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Service personnel modifié avec succès" });

    }, { auth: true, body: personalServiceSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "propertyManagement", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const personalService = await prisma.personalService.findUnique({
            where: { id: params.id },
            include: {
                propertyManagements: true
            }
        });

        if (!personalService) return status(400, { message: "Aucune donnée trouvée." })

        if (personalService.propertyManagements.length > 0) return status(400, { message: "Des propriétés sont reliées à ce service personnel." });

        await prisma.personalService.delete({
            where: {
                id: params.id,
            }
        });

        return status(200)

    }, { auth: true, params: t.Object({ id: t.String() }) })