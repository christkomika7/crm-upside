import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { Decimal } from "decimal.js"
import request from "./type";
import { formatDateToString } from "../../lib/utils";
import { reservationSchema } from "../../lib/zod/reservations";

export const reservationRoutes = new Elysia({ prefix: "/reservation" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {

        if (!canAccess(permission, "reservations", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const reservations = await prisma.reservation.findMany({
            include: { unit: true },
            orderBy: { createdAt: "desc" },
        });

        const reservationParsed = await Promise.all(
            reservations.map(async (reservation) => {
                return {
                    ...reservation,
                    unit: reservation.unit.reference,
                    start: formatDateToString(reservation.start),
                    end: formatDateToString(reservation.end),
                    rent: reservation.unit.rent,
                    charges: reservation.unit.charges
                };
            })
        );

        return reservationParsed;

    }, {
        auth: true,
    })
    .get("/:id", async ({ params, permission, status }) => {

        if (!canAccess(permission, "reservations", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: params.id },
            include: {
                unit: true
            }
        });

        if (!reservation) {
            return status(404, { message: "Aucune réservation trouvée" });
        }

        return reservation;

    }, { auth: true, params: request.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "reservations", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const { success, data } = reservationSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Réservation invalide" });
            }

            await prisma.reservation.create({
                data: {
                    name: data.name,
                    contact: data.contact,
                    price: new Decimal(data.price),
                    start: data.start,
                    end: data.end,
                    unit: {
                        connect: { id: data.unit }
                    },
                },
            });

            return status(201, { message: "Réservation créée avec succès" });

        } catch (error) {
            console.error(error);

            return status(500, {
                message: "Erreur lors de la création de la réservation",
            });
        }
    },
        {
            auth: true,
            body: request.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "reservations", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;

        const reservation = await prisma.reservation.findUnique({
            where: { id },
        });

        if (!reservation) {
            return status(404, { message: "Réservation non trouvée" });
        }

        try {
            const { success, data } = reservationSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Réservation invalide" });
            }

            await prisma.reservation.update({
                where: {
                    id: params.id
                },
                data: {
                    name: data.name,
                    contact: data.contact,
                    price: new Decimal(data.price),
                    start: data.start,
                    end: data.end,
                    unit: {
                        connect: { id: data.unit }
                    },
                },
            });

            return status(201, { message: "Réservation modifiée avec succès" });

        } catch (error) {
            console.error(error);

            return status(500, {
                message: "Erreur lors de la modification de la réservation",
            });
        }



    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "reservations", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const reservation = await prisma.reservation.findUnique({
            where: { id },
            include: {
                unit: true,
            }
        });

        if (!reservation) return status(400, { message: "Aucune réservation trouvée." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: reservation.id,
                    type: "RESERVATION",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.reservation.update({
                where: { id: reservation.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression de la réservation de ${reservation.name} est en attente de suppression.` });
    }, { auth: true, params: request.params })

