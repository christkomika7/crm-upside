import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { duration, formatDateToString } from "../../lib/utils";
import request from "./type";
import { rentalSchema } from "../../lib/zod/rentals";
import Decimal from "decimal.js";

export const rentalRoutes = new Elysia({ prefix: "/rental" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {

        if (!canAccess(permission, "rentals", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const rentals = await prisma.rental.findMany({
            include: {
                tenant: true,
                unit: {
                    include: {
                        building: {
                            include: {
                                owner: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const rentalsParse = await Promise.all(
            rentals.map(async (rental) => {
                return {
                    ...rental,
                    reference: rental.unit.building.owner ? `${rental.unit.building.owner.firstname} ${rental.unit.building.owner.lastname}` : "-",
                    unit: rental.unit.reference,
                    tenant: `${rental.tenant.firstname} ${rental.tenant.lastname}`,
                    type: rental.unit.furnished,
                    start: formatDateToString(rental.start),
                    duration: duration(rental.start, rental.end),
                    rentPrice: rental.price,
                    charges: rental.unit.charges,
                    desposit: new Decimal(rental.price).plus(rental.unit.charges).toString()
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

    }, { auth: true, params: request.params })
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
            body: request.body
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



    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "rentals", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const rental = await prisma.rental.findUnique({
            where: { id },
            include: {
                unit: true,
            }
        });

        if (!rental) return status(400, { message: "Aucune location trouvée." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: rental.id,
                    type: "RENTAL",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.rental.update({
                where: { id: rental.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression de la location de l'unité ${rental.unit.reference} est en attente de validation.` });
    }, { auth: true, params: request.params })

