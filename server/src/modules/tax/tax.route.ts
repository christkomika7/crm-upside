import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { taxSchema } from "../../lib/zod/settings";
import { Prisma } from "../../generated/prisma/client";

export const taxRoutes = new Elysia({ prefix: "/tax" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.tax.findMany({
            include: {
                cumuls: true
            }
        });
    }, { auth: true })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const tax = await prisma.tax.findUnique({
            where: { id: params.id },
            include: {
                cumuls: true
            }
        });

        if (!tax) {
            return status(404, { message: "Tax non trouvé" });
        }

        return tax;
    }, { auth: true })
    .post("/create", async ({ permission, status, body }) => {
        if (!canAccess(permission, "settings", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = taxSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Tax invalide" });
        }

        const existing = await prisma.tax.findFirst({ where: { name: data.name } });
        if (existing) {
            return status(400, { message: "Tax déjà existante" });
        }

        try {
            await prisma.tax.create({
                data: {
                    name: data.name,
                    value: data.rate,
                    cumuls: {
                        create: data.cumul?.map(item => ({
                            name: item.name,
                            value: item.rate,
                        })) ?? []
                    }
                }
            });
            return status(200, { message: "Tax créée avec succès" });

        } catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return status(400, { message: "Cette taxe existe déjà" });
                }
            }
            return status(500, { message: "Tax non créée" });
        }
    }, { auth: true, body: taxSchema })
    .put("/:id", async ({ permission, status, params, body }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = taxSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Tax invalide" });
        }

        const id = params.id;

        const [existingTax, taxWithRelations] = await prisma.$transaction([
            prisma.tax.findFirst({
                where: { name: data.name, NOT: { id } },
            }),
            prisma.tax.findUnique({
                where: { id },
                include: {
                    cumuls: true
                }
            })
        ]);


        if (existingTax) {
            return status(400, { message: "Une taxe avec ce nom existe déjà" });
        }

        if (
            (taxWithRelations?.cumuls?.length ?? 0) > 0 &&
            taxWithRelations?.name !== data.name
        ) {
            return status(400, {
                message: "Impossible de modifier le nom d'une taxe utilisée dans un cumul"
            });
        }

        try {
            const cumulConnectOrCreate = await Promise.all(
                (data.cumul ?? []).map(async (item) => {
                    let cumul = await prisma.cumul.findFirst({
                        where: { name: item.name }
                    });

                    if (!cumul) {
                        cumul = await prisma.cumul.create({
                            data: {
                                name: item.name,
                                value: item.rate,
                            }
                        });
                    }

                    return { id: cumul.id };
                })
            );

            await prisma.tax.update({
                where: { id },
                data: {
                    name: data.name,
                    value: data.rate,
                    cumuls: {
                        set: cumulConnectOrCreate
                    }
                }
            });

            return status(200, { message: "Tax modifiée avec succès" });

        } catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return status(400, { message: "Cette taxe existe déjà" });
                }
            }
            return status(500, { message: "Tax non modifiée" });
        }

    }, { auth: true, body: taxSchema })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const tax = await prisma.tax.findUnique({ where: { id: params.id } });
        if (!tax) {
            return status(404, { message: "Tax non trouvé" });
        }

        await prisma.tax.delete({ where: { id: params.id } });

        return status(200, { message: "Tax supprimée avec succès" });
    }, { auth: true })