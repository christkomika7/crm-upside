import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { noteSchema } from "../../lib/zod/settings";

export const noteRoutes = new Elysia({ prefix: "/note" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.note.findFirst()

    }, { auth: true })
    .put("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = noteSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Note invalide" });
        }

        const note = await prisma.note.findFirst();

        if (!note) {
            await prisma.note.create({
                data: {
                    invoice: data.invoice || "",
                    quote: data.quote || "",
                    purchaseOrder: data.purchaseOrder || "",
                }
            });

            return status(200, { message: "Note créée avec succès" });
        }

        await prisma.note.update({
            where: {
                id: note?.id,
            },
            data: {
                invoice: data.invoice,
                quote: data.quote,
                purchaseOrder: data.purchaseOrder,
            }
        });

        return status(200, { message: "Note modifiée avec succès" });

    }, { auth: true, body: noteSchema })