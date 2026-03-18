import { Elysia } from "elysia"
import { authPlugin } from "../auth/auth"
import request from "./type";
import { canAccess } from "../auth/permission";
import { prisma } from "../../lib/prisma";
import { deleteFile } from "../../lib/storage";
import { formatDateToString } from "../../lib/utils";

export const deletionRoutes = new Elysia({ prefix: "/deletion" })
    .use(authPlugin)
    .get("/by", async ({ status, permission, query, user }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const type = query.type;

        if (!type) return status(404, { message: "Aucun type trouvé." });

        const deletions = await prisma.deletion.findMany({
            where: {
                type,
                state: "WAIT"
            },
        });

        switch (type) {
            case "BUILDING":
                const buildingDeltion = [];
                for (const deletion of deletions) {
                    const building = await prisma.building.findUnique({
                        where: { id: deletion.recordId }
                    });

                    if (!building) return status(400, { message: "Aucun bàtiment trouvée." });

                    buildingDeltion.push({
                        id: deletion.id,
                        reference: `${building.reference}`,
                        name: building.name,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return buildingDeltion;
            case "OWNER":
            case "TENANT":
            case "UNIT":
            case "RENTAL":
            case "RESERVATION":
                const reservationParsed = [];
                let index = 0;
                for (const deletion of deletions) {
                    const reservation = await prisma.reservation.findUnique({
                        where: { id: deletion.recordId }
                    });

                    if (!reservation) return status(400, { message: "Aucun réservation trouvée." });

                    reservationParsed.push({
                        id: deletion.id,
                        reference: `${index + 1}`,
                        name: reservation.name,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return reservationParsed;
            case "PROPERTY_MANAGEMENT":
            case "INVOICING":
            case "QUOTE":
            case "CONTRACT":
            case "CHECK_IN":
            case "APPOINTMENT":
            case "SERVICE_PROVIDER":
            case "COMMUNICATION":
        }
    }, { auth: true, query: request.query })
    .put("/:id", async ({ status, params, body, permission, user }) => {

        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé." });
        }

        if (user.role !== "ADMIN") {
            return status(403, { message: "Accès autorisé uniquement pour l'administrateur." })
        }

        const deletion = await prisma.deletion.findUnique({
            where: { id: params.id }
        })


        if (!deletion) return status(400, { message: "Identifiant invalide." })

        switch (body) {
            case "CANCEL":
                try {
                    const deletion = await prisma.deletion.update({
                        where: {
                            id: params.id
                        },
                        data: {
                            state: "NOTHING"
                        }
                    });

                    switch (deletion.type) {
                        case "BUILDING":
                            const [building] = await prisma.$transaction([
                                prisma.building.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du bâtiment ${building.name} a été annulé avec succès.` });
                        case "OWNER":
                        case "TENANT":
                        case "UNIT":
                        case "RENTAL":
                        case "RESERVATION":
                        case "PROPERTY_MANAGEMENT":
                        case "INVOICING":
                        case "QUOTE":
                        case "CONTRACT":
                        case "CHECK_IN":
                        case "APPOINTMENT":
                        case "SERVICE_PROVIDER":
                        case "COMMUNICATION":
                    }

                } catch (error) {
                    console.log(error)
                    return status(500, { message: "Une erreur est survenu lors de l'annulation de la suppression." })
                }
            case "DELETE":
                try {
                    switch (deletion.type) {
                        case "BUILDING":
                            const building = await prisma.building.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!building) return status(400, { message: "Aucun bâtiment trouvé." })

                            if (building.photos) {
                                await Promise.all(building.photos.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            if (building.deeds) {
                                await Promise.all(building.deeds.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            if (building.documents) {
                                await Promise.all(building.documents.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.building.delete({ where: { id: building.id } })
                            ])

                            return status(200, { message: `Le bâtiment ${building.name} a été supprimé avec succès.` });
                        case "OWNER":
                        case "TENANT":
                        case "UNIT":
                        case "RENTAL":
                        case "RESERVATION":
                            const reservation = await prisma.reservation.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!reservation) return status(400, { message: "Aucun réservation trouvé." })


                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.reservation.delete({ where: { id: reservation.id } })
                            ])

                            return status(200, { message: `La réservation de ${reservation.name} a été supprimé avec succès.` });
                        case "PROPERTY_MANAGEMENT":
                        case "INVOICING":
                        case "QUOTE":
                        case "CONTRACT":
                        case "CHECK_IN":
                        case "APPOINTMENT":
                        case "SERVICE_PROVIDER":
                        case "COMMUNICATION":
                    }

                } catch (e) {
                    console.log(e);
                    return status(500, "Une erreur est survenu lors de la suppression.")

                }


            default:
                return status(400, "Le type d'action est invalide.");


        }

    }, { auth: true, params: request.params, body: request.body, })