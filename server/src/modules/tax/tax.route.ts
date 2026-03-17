import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { taxSchema } from "../../lib/zod/settings";

export const taxRoutes = new Elysia({ prefix: "/tax" })
    .use(authPlugin)
    .get("/all", async ({ permission, status }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.tax.findMany()

    }, { auth: true })
    .get("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const tax = await prisma.tax.findUnique({ where: { id: params.id } })
        if (!tax) {
            return status(404, { message: "Tax non trouvé" });
        }

        return tax
    }, { auth: true })
    .post("/create", async ({ permission, status, body }) => {
        if (!canAccess(permission, "settings", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = taxSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Tax invalide" });
        }

        const tax = await prisma.tax.findFirst({ where: { name: data.name } })
        if (tax) {
            return status(400, { message: "Tax déjà existante" });
        }

        await prisma.tax.create({
            data: {
                name: data.name,
                value: data.rate,
            }
        });

        return status(200, { message: "Tax créée avec succès" });

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

        const existingTax = await prisma.tax.findFirst({
            where: {
                name: data.name,
                NOT: {
                    id: id,
                },
            },
        });

        if (existingTax) {
            return status(400, {
                message: "Une taxe avec ce nom existe déjà",
            });
        }

        await prisma.tax.update({
            where: { id },
            data: {
                name: data.name,
                value: data.rate,
            },
        });

        return status(200, {
            message: "Tax modifiée avec succès",
        });

    }, { auth: true, body: taxSchema })
    .delete("/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const tax = await prisma.tax.findUnique({ where: { id: params.id } })
        if (!tax) {
            return status(404, { message: "Tax non trouvé" });
        }

        await prisma.tax.delete({ where: { id: params.id } })

        return status(200, { message: "Tax supprimée avec succès" });
    }, { auth: true })