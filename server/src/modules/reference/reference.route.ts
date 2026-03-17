import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { referenceSchema } from "../../lib/zod/settings";

export const referenceRoutes = new Elysia({ prefix: "/reference" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.reference.findFirst()

    }, { auth: true })
    .put("/", async ({ permission, status, body }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }


        const { success, data, error } = referenceSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Les donnes de références sont invalides." });
        }

        const reference = await prisma.reference.findFirst()

        if (!reference) {
            await prisma.reference.create({
                data: {
                    owner: data?.owner || "",
                    building: data.building || "",
                    unit: data.unit || "",
                    rental: data.rental || "",
                    invoicing: data.invoicing || "",
                    contract: data.contract || "",
                    checkIn: data.checkIn || "",
                }
            });

            return status(200, { message: "Référence créée avec succès" });

        }

        await prisma.reference.update({
            where: {
                id: reference?.id,
            },
            data: {
                owner: data.owner,
                building: data.building,
                unit: data.unit,
                rental: data.rental,
                invoicing: data.invoicing,
                contract: data.contract,
                checkIn: data.checkIn,
            }
        });

        return status(200, { message: "Référence modifiée avec succès" });

    }, { auth: true, body: referenceSchema })