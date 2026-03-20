import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import { propertyManagementSchema } from "../../lib/zod/property-management";

export const propertyManagementRoutes = new Elysia({ prefix: "/property-management" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {

        if (!canAccess(permission, "propertyManagement", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const propertyManagements = await prisma.propertyManagement.findMany({
            include: { unit: true, building: true, services: true },
            orderBy: { createdAt: "desc" },
        });

        const propertyManagementsParsed = await Promise.all(
            propertyManagements.map(async (propertyManagement) => {
                return {
                    ...propertyManagement,
                    building: propertyManagement.building.name,
                    unit: propertyManagement.unit.reference,
                    management: propertyManagement.active ? "Oui" : "Non",
                    services: propertyManagement.services.map(service => service.name),
                    commission: "-"
                };
            })
        );

        return propertyManagementsParsed;

    }, {
        auth: true,
    })
    .get("/:id", async ({ params, permission, status }) => {

        if (!canAccess(permission, "propertyManagement", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const propertyManagement = await prisma.propertyManagement.findUnique({
            where: { id: params.id },
            include: {
                unit: true,
                building: true,
                services: true
            }
        });

        if (!propertyManagement) {
            return status(404, { message: "Aucune gestion de propriété trouvée" });
        }

        return propertyManagement;

    }, { auth: true, params: request.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "propertyManagement", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const { success, data } = propertyManagementSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Gestion de propriété invalide" });
            }

            await prisma.propertyManagement.create({
                data: {
                    building: {
                        connect: { id: data.building }
                    },
                    unit: {
                        connect: { id: data.unit }
                    },
                    administrativeManagement: data.administrativeManagement,
                    technicalManagement: data.technicalManagement,
                    services: {
                        connect: data.services?.map(service => ({ id: service }))
                    },
                    observations: data.observation,
                    start: data.start,
                    end: data.end,
                    active: data.active
                },
            });

            return status(201, { message: "Gestion de propriété créée avec succès" });

        } catch (error) {
            console.error(error);

            return status(500, {
                message: "Erreur lors de la création de la gestion de propriété",
            });
        }
    },
        {
            auth: true,
            body: request.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "propertyManagement", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;

        const propertyManagement = await prisma.propertyManagement.findUnique({
            where: { id },
        });

        if (!propertyManagement) {
            return status(404, { message: "Gestion de propriété non trouvée" });
        }

        try {
            const { success, data } = propertyManagementSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Gestion de propriété invalide" });
            }

            await prisma.propertyManagement.update({
                where: {
                    id: params.id
                },
                data: {
                    building: {
                        connect: { id: data.building }
                    },
                    unit: {
                        connect: { id: data.unit }
                    },
                    administrativeManagement: data.administrativeManagement,
                    technicalManagement: data.technicalManagement,
                    services: {
                        set: data.services?.map(service => ({ id: service }))
                    },
                    observations: data.observation,
                    start: data.start,
                    end: data.end,
                    active: data.active
                },
            });

            return status(201, { message: "Gestion de propriété modifiée avec succès" });

        } catch (error) {
            console.error(error);

            return status(500, {
                message: "Erreur lors de la modification de la gestion de propriété",
            });
        }



    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "propertyManagement", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const propertyManagement = await prisma.propertyManagement.findUnique({
            where: { id },
            include: {
                unit: true,
            }
        });

        if (!propertyManagement) return status(400, { message: "Aucune gestion de propriété trouvée." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: propertyManagement.id,
                    type: "PROPERTY_MANAGEMENT",
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.propertyManagement.update({
                where: { id: propertyManagement.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La gestion de propriété de l'appartement ${propertyManagement.unit.reference} est en attente de suppression.` });
    }, { auth: true, params: request.params })

