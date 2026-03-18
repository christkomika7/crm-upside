import { Elysia } from "elysia";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import { prisma } from "./prisma";
import { getSignedFileUrl } from "./storage";
import { $Enums } from "../generated/prisma/client";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        additionalFields: {
            permission: {
                type: "string",
                required: false,
            },
            role: {
                type: "string",
                required: false,
            }
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
            },
            emailVerified: {
                type: "boolean",
                required: false,
            }
        },
    },
    advanced: {
        useSecureCookies: true,
        cookiePrefix: "upside",
        crossSubDomainCookies: {
            enabled: true,
            // domain: "upside-gabon.com",
            domain: "localhost"
        }

    },
    plugins: [
        customSession(async ({ user, session }) => {
            const image = user.image ? await getSignedFileUrl(user.image) : undefined;
            const permission = await prisma.permission.findUnique({
                where: { userId: user.id },
                include: {
                    user: true
                }
            });



            return {
                user: {
                    ...user,
                    role: permission?.user.role || $Enums.Role.USER,
                    permission: permission,
                    image,
                },
                session
            };
        }),
    ],
    trustedOrigins: ["https://crm.upside-gabon.com", "http://localhost:5173"],
});


export const betterAuthPlugin = new Elysia()
    .all("/api/auth/*", ({ request }) => auth.handler(request))

export type Auth = typeof auth;
