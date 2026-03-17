import { Elysia } from "elysia";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { getSignedFileUrl } from "../../lib/storage";

export const authPlugin = new Elysia({ name: "better-auth" })
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({ headers });
                if (!session) return status(401, "Utilisateur non authentifié");
                const { user } = session;
                if (!user) return status(401, "Utilisateur non authentifié");
                const permission = await prisma.permission.findUnique({
                    where: { userId: user.id },
                })

                const image = user.image ? await getSignedFileUrl(user.image) : undefined;

                return {
                    user: {
                        ...user,
                        image,
                    },
                    session: session.session,
                    permission: permission!.permissions,
                };
            },
        },
    });

export type AuthPlugin = typeof authPlugin;