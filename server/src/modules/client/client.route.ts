import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";

export const clientRoutes = new Elysia({ prefix: "/client" })
    .use(authPlugin)
    .get("/by", async ({ permission, status, query }) => {
        const invoicingAccess = canAccess(permission, "invoicing", ['read']);
        const quoteAccess = canAccess(permission, "quotes", ['read']);
        const appointmentAccess = canAccess(permission, "appointments", ['read']);

        console.log({ invoicingAccess, quoteAccess, appointmentAccess })

        if (!invoicingAccess || !quoteAccess || !appointmentAccess) {
            return status(403, { message: "Accès refusé" });
        }

        switch (query.type) {
            case "OWNER":
                return await prisma.owner.findMany({
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    }
                })
            case "TENANT":
                return await prisma.tenant.findMany({
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    }
                })
        }
    }, { auth: true, query: request.query })