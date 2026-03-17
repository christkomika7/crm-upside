import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { duration, formatDateToString } from "../../lib/utils";
import requestType from "./type";
import { rentalSchema } from "../../lib/zod/rentals";

export const rentalRoutes = new Elysia({ prefix: "/rental" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {

        if (!canAccess(permission, "rentals", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const rentals = await prisma.rental.findMany({
            include: {
                tenant: true,
                unit: true
            },
            orderBy: { createdAt: "desc" },
        });

        const rentalsParse = await Promise.all(
            rentals.map(async (rental) => {
                return {
                    ...rental,
                    unit: rental.unit.reference,
                    tenant: `${rental.tenant.firstname} ${rental.tenant.firstname}`,
                    type: rental.unit.furnished,
                    start: formatDateToString(rental.start),
                    duration: duration(rental.start, rental.end),
                    rentPrice: rental.price,
                    charges: rental.unit.charges,
                    desposit: "-"
                };
            })
        );

        return rentalsParse;

    }, {
        auth: true,
    })
    .get("/:id", async ({ params, permission, status, server }) => {
        if (!canAccess(permission, "rentals", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const rental = await prisma.rental.findUnique({
            where: { id: params.id },
        });

        if (!rental) {
            return status(404, { message: "Aucun propriétaire trouvé" });
        }

        return rental

    }, { auth: true, params: requestType.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "rentals", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const { success, data } = rentalSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations de la location sont invalide" });
            }

            await prisma.rental.create({
                data: {
                    price: data.price,
                    start: data.start,
                    end: data.end,
                    tenant: {
                        connect: {
                            id: data.tenant
                        }
                    },
                    building: {
                        connect: {
                            id: data.building
                        }
                    },
                    unit: {
                        connect: {
                            id: data.unit
                        }
                    }
                },
            });

            return status(201, { message: "Location créée avec succès" });

        } catch (error) {
            console.error(error);

            return status(500, {
                message: "Erreur lors de la création de la location",
            });
        }
    },
        {
            auth: true,
            body: requestType.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "rentals", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const rental = await prisma.rental.findUnique({
            where: { id },
        });

        if (!rental) {
            return status(404, { message: "Location non trouvée" });
        }


        try {
            const { success, data } = rentalSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations de la location sont invalide" });
            }

            await prisma.rental.update({
                where: {
                    id: params.id
                },
                data: {
                    price: data.price,
                    start: data.start,
                    end: data.end,
                    tenant: {
                        connect: {
                            id: data.tenant
                        }
                    },
                    building: {
                        connect: {
                            id: data.building
                        }
                    },
                    unit: {
                        connect: {
                            id: data.unit
                        }
                    }
                },
            });

            return status(201, { message: "Location modifiée avec succès" });

        } catch (error) {
            console.error(error);

            return status(500, {
                message: "Erreur lors de la modification de la location",
            });
        }



    }, { auth: true, body: requestType.body, params: requestType.params })
    .delete("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "rentals", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        await prisma.rental.delete({
            where: { id },
        });


        return { message: "Location supprimée avec succès" };
    }, { auth: true })

