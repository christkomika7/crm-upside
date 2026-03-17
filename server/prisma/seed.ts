import { prisma } from "../src/lib/prisma";
import { $Enums } from "../src/generated/prisma/client";
import { hashPassword } from "better-auth/crypto";
import { actions, modules } from "../src/lib/zod/permissions";

async function main() {
    const { USER_EMAIL, USER_PASSWORD, USER_FIRSTNAME, USER_LASTNAME } = process.env;

    if (!USER_EMAIL || !USER_PASSWORD || !USER_FIRSTNAME || !USER_LASTNAME) {
        throw new Error("Missing required environment variables.");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: USER_EMAIL },
    });


    if (existingUser) {
        console.log("✅ Admin already exists. Seed skipped.");
        return;
    }

    const hashedPassword = await hashPassword(USER_PASSWORD);

    const userId = crypto.randomUUID();

    const fullPermissions = modules.reduce((acc, module) => {
        acc[module] = [...actions];
        return acc;
    }, {} as Record<string, string[]>);

    await prisma.user.create({
        data: {
            id: userId,
            firstname: USER_FIRSTNAME,
            lastname: USER_LASTNAME,
            name: `${USER_FIRSTNAME} ${USER_LASTNAME}`,
            email: USER_EMAIL,
            emailVerified: true,
            role: $Enums.Role.ADMIN,
            permission: {
                create: {
                    permissions: fullPermissions,
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

    console.log("🚀 Admin with full permissions created successfully.");
}

main()
    .then(async () => {
        console.log("🌱 Seeding finished.");
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });