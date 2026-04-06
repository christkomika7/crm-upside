import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { professionSchema } from "../../lib/zod/service-providers";

export const professionRoutes = new Elysia({ prefix: "/profession" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "serviceProviders", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.profession.findMany({
            orderBy: {
                name: "desc",
            }
        })

    }, { auth: true })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "serviceProviders", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        return await prisma.profession.findUnique({
            where: {
                id: params.id,
            }
        })

    }, { auth: true, params: t.Object({ id: t.String() }) })
    .post("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "serviceProviders", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = professionSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Profession invalide" });
        }

        const alreadyExist = await prisma.profession.findUnique({
            where: {
                name: data.name,
            }
        })

        if (alreadyExist) {
            return status(400, { message: "Profession existe déjà" });
        }

        await prisma.profession.create({
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Profession créée avec succès" });

    }, { auth: true, body: professionSchema })
    .put("/:id", async ({ permission, status, body, params }) => {
        if (!canAccess(permission, "serviceProviders", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const { success, data } = professionSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Profession invalide" });
        }

        const alreadyExist = await prisma.profession.findFirst({
            where: {
                name: data.name,
                NOT: {
                    id: params.id,
                },
            },
        });

        if (alreadyExist) {
            return status(400, { message: "Profession existe déjà" });
        }

        await prisma.profession.update({
            where: {
                id: params.id,
            },
            data: {
                name: data.name,
            }
        })

        return status(200, { message: "Profession modifiée avec succès" });

    }, { auth: true, body: professionSchema, params: t.Object({ id: t.String() }) })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "serviceProviders", ['create', 'update'])) {
            return status(403, { message: "Accès refusé" });
        }

        if (!params.id) {
            return status(400, { message: "Aucun identifiant trouvé" });
        }

        const profession = await prisma.profession.findUnique({
            where: { id: params.id },
            include: {
                serviceProviders: true
            }
        });

        if (!profession) return status(400, { message: "Aucune donnée trouvée." })

        if (profession.serviceProviders.length > 0) return status(400, { message: "Des prestataires sont reliés à cette profession." });

        await prisma.profession.delete({
            where: {
                id: params.id,
            }
        });

        return status(200)

    }, { auth: true, params: t.Object({ id: t.String() }) })