import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { randomUUID } from "crypto";
import { deleteFile, getSignedFileUrl, uploadFile } from "../../lib/storage";
import { modules, permissionsSchema } from "../../lib/zod/permissions";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { emailSchema, passwordSchema } from "../../lib/zod/user";

export const userRoutes = new Elysia({ prefix: "/users" })
    .use(authPlugin)
    .get("/all", async ({ permission, status }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const users = await prisma.user.findMany({
            include: { permission: true },
        });

        const usersWithSignedUrl = await Promise.all(
            users.map(async (user) => ({
                ...user,
                image: user.image ? await getSignedFileUrl(user.image) : null,
            }))
        );

        return usersWithSignedUrl;
    }, { auth: true })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return status(404, { message: "Utilisateur non trouvé" });
        }

        return user;


    }, { auth: true })
    .post("/create", async ({ body, permission, status }) => {
        if (!canAccess(permission, "settings", "create")) {
            return status(403, { message: "Accès refusé" });
        }
        try {
            const { image, email, password, firstname, lastname, role } = body as any;

            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return status(400, { message: "Email déjà utilisé" });
            }

            let imageKey: string | null = null;

            if (image) {
                const buffer = Buffer.from(await image.arrayBuffer());
                const key = `avatars/${randomUUID()}-${image.name}`;
                await uploadFile(key, buffer, image.type);
                imageKey = key;
            }

            const userId = crypto.randomUUID();
            const hashedPassword = await hashPassword(password);

            const permissions = modules.reduce((acc, module) => {
                acc[module] = [];
                return acc;
            }, {} as Record<string, string[]>);

            await prisma.user.create({
                data: {
                    id: userId,
                    name: `${firstname} ${lastname}`,
                    email: email,
                    emailVerified: true,
                    role: role,
                    image: imageKey,
                    permission: {
                        create: {
                            permissions: permissions,
                        },
                    },

                    accounts: {
                        create: {
                            id: crypto.randomUUID(),
                            accountId: userId,
                            providerId: "credential",
                            password: hashedPassword,
                        },
                    },
                },
            });



        } catch (error) {
            console.error(error);
            return status(500, {
                message: "Erreur lors de la création de l'utilisateur",
            });
        }
    }, { auth: true })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const { image, firstname, lastname } = body as any;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return status(404, { message: "Utilisateur non trouvé" });
        }


        if (user.image) {
            await deleteFile(user.image)
        }

        let imageKey: string | null = null;

        if (image) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const key = `avatars/${randomUUID()}-${image.name}`;
            await uploadFile(key, buffer, image.type);
            imageKey = key;
        }

        await prisma.user.update({
            where: { id },
            data: {
                name: `${firstname} ${lastname}`,
                firstname,
                lastname,
                image: imageKey,
            },
        });

        return { message: "Utilisateur modifié avec succès" };
    }, { auth: true })
    .put("/:id/email", async ({ params, body, permission, status, cookie }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const { success, data } = emailSchema.safeParse(body);
        console.log({ success, data, body })
        if (!success) {
            return status(400, { message: "Email invalide" });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                accounts: true
            }
        });

        if (!user || !user.accounts[0]) {
            return status(404, { message: "Utilisateur non trouvé" });
        }

        const oldPassword = user.accounts[0].password as string;
        const isPasswordValid = await verifyPassword({ hash: oldPassword, password: data.password });

        if (!isPasswordValid) {
            console.log('Mot de passe invalide')
            return status(400, { message: "Mot de passe invalide" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return status(400, { message: "Email déjà utilisé" });
        }

        await prisma.user.update({
            where: { id },
            data: {
                email: data.email,
            },
        });

        return { message: "Email modifié avec succès" };
    }, { auth: true })
    .put("/:id/password", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const { success, data } = passwordSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Données invalides" });
        }


        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                accounts: true
            }
        });

        if (!user || !user.accounts[0]) {
            return status(404, { message: "Utilisateur non trouvé" });
        }

        const oldPassword = user.accounts[0].password as string;
        const isPasswordValid = await verifyPassword({ hash: oldPassword, password: data.password });

        if (!isPasswordValid) {
            return status(400, { message: "Mot de passe actuel invalide" });
        }

        const hashedPassword = await hashPassword(data.newPassword);

        await prisma.account.updateMany({
            where: { userId: id },
            data: {
                password: hashedPassword,
            },
        });

        return { message: "Mot de passe modifié avec succès" };
    }, { auth: true })
    .put("/:id/permissions", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const { success, data } = permissionsSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Données invalides" });
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return status(404, { message: "Utilisateur non trouvé" });
        }

        await prisma.permission.update({
            where: { userId: id },
            data: {
                permissions: data,
            },
        });

        return { message: "Utilisateur modifié avec succès" };
    }, { auth: true })
    .delete("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const owner = await prisma.user.delete({
            where: { id },
        });

        if (owner.image) {
            await deleteFile(owner.image)
        }

        return { message: "Utilisateur supprimé avec succès" };
    }, { auth: true })
    .delete("/:id/image", async ({ params, permission, status }) => {
        if (!canAccess(permission, "settings", "update")) {
            return status(403, { message: "Accès refusé" });
        }
        const id = params.id;
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return status(404, { message: "Utilisateur non trouvé" });
        }

        if (user.image) {
            await deleteFile(user.image)
        }

        await prisma.user.update({
            where: { id },
            data: {
                image: undefined,
            },
        });

        return { message: "Utilisateur modifié avec succès" };
    }, { auth: true })