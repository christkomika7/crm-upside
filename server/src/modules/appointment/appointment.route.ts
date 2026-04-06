import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import { formatDateToString } from "../../lib/utils";
import { appointmentSchema } from "../../lib/zod/appointment";
import { sendMail } from "../../lib/email";

export const appointmentRoutes = new Elysia({ prefix: "/appointment" })
    .use(authPlugin)
    .get("/stats", async ({ permission, status }) => {
        if (!canAccess(permission, "appointments", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        const now = new Date()

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const appointments = await prisma.appointment.findMany({
            where: { isDeleting: false },
            select: {
                date: true,
                hour: true,
                minutes: true,
                isComplete: true,
            }
        })

        const withDateTime = appointments.map((a) => {
            const fullDate = new Date(a.date)
            fullDate.setHours(parseInt(a.hour), parseInt(a.minutes), 0, 0)
            return { ...a, fullDate }
        })

        const upcoming = withDateTime
            .filter((a) => a.fullDate > now && !a.isComplete)
            .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())[0]

        const formatUpcoming = (target: Date): string => {
            const diffMs = target.getTime() - now.getTime()
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

            const months = Math.floor(diffDays / 30)
            const days = diffDays % 30

            if (months > 0 && days > 0) return `dans ${months} mois et ${days}j`
            if (months > 0) return `dans ${months} mois`
            if (days > 0) return `dans ${days}j`
            return "aujourd'hui"
        }

        const stats = withDateTime.reduce(
            (acc, a) => {
                const isToday = a.fullDate >= startOfDay && a.fullDate <= endOfDay
                const isExpired = a.fullDate < now && !a.isComplete

                if (isToday) acc.today++
                if (isExpired) acc.expired++
                if (a.isComplete) acc.completed++

                return acc
            },
            { today: 0, expired: 0, completed: 0 }
        )

        return {
            ...stats,
            upcoming: upcoming ? formatUpcoming(upcoming.fullDate) : null,
        }
    }, { auth: true })
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "appointments", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        const now = new Date()

        const appointments = await prisma.appointment.findMany({
            include: {
                owner: true,
                tenant: true,
                teamMembers: true
            },
            orderBy: {
                date: "asc",
            }
        })

        const filtered = appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.date)
            appointmentDate.setHours(parseInt(appointment.hour), parseInt(appointment.minutes), 0, 0)

            if (query.type === "WAIT") {
                return appointmentDate >= now && !appointment.isComplete
            } else if (query.type === "EXPIRED") {
                return appointmentDate < now || appointment.isComplete
            }

            return true
        });

        return filtered.map((appointment) => {
            const appointmentDate = new Date(appointment.date)
            appointmentDate.setHours(parseInt(appointment.hour), parseInt(appointment.minutes), 0, 0)

            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)

            return {
                id: appointment.id,
                date: formatDateToString(appointment.date) + " à " + appointment.hour + ":" + appointment.minutes,
                subject: appointment.subject,
                address: appointment.address,
                isDeleting: appointment.isDeleting,
                isComplete: appointment.isComplete,
                isToday: appointmentDate >= startOfDay && appointmentDate <= endOfDay,
                client:
                    appointment.type === "OWNER"
                        ? `${appointment.owner?.firstname} ${appointment.owner?.lastname}`
                        : `${appointment.tenant?.firstname} ${appointment.tenant?.lastname}`,
                members: appointment.teamMembers.map((member) => member.name)
            }
        })
    }, { auth: true, query: request.queryType })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "appointments", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const appointment = await prisma.appointment.findUnique({
            where: {
                id: params.id
            },
            include: {
                teamMembers: true,
                owner: true,
                tenant: true
            }
        });

        return {
            ...appointment,
            teamMembers: appointment?.teamMembers.map(member => member.id) || []
        }

    }, { auth: true, params: request.paramsId })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "appointments", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }
        try {
            const { success, data } = appointmentSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Rendez-vous invalide" });
            }

            let clientName: string;
            let clientEmail: string;

            if (data.type === "OWNER") {
                const owner = await prisma.owner.findUnique({ where: { id: data.client } })
                if (!owner) return status(404, { message: "Propriétaire introuvable" })
                clientName = `${owner.firstname} ${owner.lastname}`;
                clientEmail = owner.email;
            } else {
                const tenant = await prisma.tenant.findUnique({ where: { id: data.client } })
                if (!tenant) return status(404, { message: "Locataire introuvable" })
                clientName = `${tenant.firstname} ${tenant.lastname}`;
                clientEmail = tenant.email;
            }

            const teamMembers = await prisma.user.findMany({
                where: { id: { in: data.teamMembers } },
                select: { email: true, firstname: true, lastname: true }
            });

            await prisma.appointment.create({
                data: {
                    type: data.type,
                    date: data.date,
                    hour: data.hour,
                    minutes: data.minutes,
                    subject: data.subject,
                    address: data.address,
                    note: data.note,
                    teamMembers: {
                        connect: data.teamMembers.map((id) => ({ id }))
                    },
                    ...(data.type === "OWNER"
                        ? { owner: { connect: { id: data.client } } }
                        : { tenant: { connect: { id: data.client } } }
                    ),
                },
            });

            const formattedDate = formatDateToString(new Date(data.date));
            const formattedTime = `${data.hour}h${data.minutes}`;

            await sendMail({
                from: { name: "Upside", address: process.env.EMAIL_USER as string },
                to: [clientEmail],
                subject: `Votre rendez-vous du ${formattedDate} – Upside`,
                html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">Upside</p>
                            <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Confirmation de rendez-vous</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#ffffff;padding:40px;">
                            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong style="color:#18181b;">${clientName}</strong>,</p>
                            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#52525b;">
                                Nous vous confirmons votre rendez-vous avec notre équipe. Voici le récapitulatif :
                            </p>

                            <!-- Carte RDV -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:0;overflow:hidden;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                                                    <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Objet</p>
                                                    <p style="margin:0;font-size:18px;font-weight:700;color:#18181b;">${data.subject}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0;">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:16px 20px;width:50%;border-right:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Date</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${formattedDate}</p>
                                                            </td>
                                                            <td style="padding:16px 20px;width:50%;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Heure</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${formattedTime}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Adresse</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${data.address}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            ${data.note ? `<p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:#71717a;">${data.note}</p>` : ""}

                            <div style="border-top:1px solid #f4f4f5;padding-top:28px;">
                                <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service Client</p>
                                <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                            <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
            });

            if (teamMembers.length > 0) {
                await sendMail({
                    from: { name: "Upside", address: process.env.EMAIL_USER as string },
                    to: teamMembers.map(m => m.email),
                    subject: `Nouveau rendez-vous – ${data.subject} – ${formattedDate}`,
                    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">Upside</p>
                            <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Nouveau rendez-vous planifié</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#ffffff;padding:40px;">
                            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour,</p>
                            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#52525b;">
                                Un nouveau rendez-vous a été planifié et vous y êtes assigné(e). Voici le récapitulatif :
                            </p>

                            <!-- Carte RDV -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:0;overflow:hidden;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                                                    <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Objet</p>
                                                    <p style="margin:0;font-size:18px;font-weight:700;color:#18181b;">${data.subject}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0;">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:16px 20px;width:50%;border-right:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Date</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${formattedDate}</p>
                                                            </td>
                                                            <td style="padding:16px 20px;width:50%;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Heure</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${formattedTime}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:16px 20px;border-top:1px solid #f0f0f0;border-right:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Client</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${clientName}</p>
                                                            </td>
                                                            <td style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Type</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${data.type === "OWNER" ? "Propriétaire" : "Locataire"}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Adresse</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${data.address}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            ${data.note ? `
                            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
                                <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#92400e;">Note</p>
                                <p style="margin:0;font-size:14px;line-height:1.6;color:#78350f;">${data.note}</p>
                            </div>` : ""}

                            <div style="border-top:1px solid #f4f4f5;padding-top:28px;">
                                <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service Client</p>
                                <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                            <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
                });
            }

            return status(201, { message: "Rendez-vous créé avec succès." })
        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la création du rendez-vous.",
            });
        }
    }, { auth: true, body: request.body })
    .put("/complete/:id", async ({ permission, status, params }) => {
        if (!canAccess(permission, "appointments", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const appointment = await prisma.appointment.findUnique({
                where: {
                    id: params.id
                }
            })

            if (!appointment) {
                return status(404, { message: "Rendez-vous non trouvé" });
            }

            if (appointment.isDeleting) {
                return status(400, { message: "Rendez-vous en cours de suppression" });
            }

            await prisma.$transaction(async tx => {
                await tx.appointment.update({
                    where: {
                        id: params.id
                    },
                    data: {
                        isComplete: true
                    },
                });
            })

            return status(200, { message: "Rendez-vous marqué comme terminé" })

        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la finalisation du rendez-vous",
            });
        }
    }, { auth: true, params: request.paramsId })
    .put("/:id", async ({ body, permission, status, params }) => {
        if (!canAccess(permission, "appointments", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const appointment = await prisma.appointment.findUnique({
                where: { id: params.id }
            })

            if (!appointment) {
                return status(404, { message: "Rendez-vous non trouvé" });
            }

            if (appointment.isDeleting) {
                return status(400, { message: "Rendez-vous en cours de suppression" });
            }

            const { success, data } = appointmentSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Rendez-vous invalide" });
            }

            // Détecter si la date/heure a changé
            const oldDate = new Date(appointment.date);
            const newDate = new Date(data.date);
            const dateChanged =
                oldDate.toDateString() !== newDate.toDateString() ||
                appointment.hour !== data.hour ||
                appointment.minutes !== data.minutes;

            const oldFormattedDate = formatDateToString(oldDate);
            const oldFormattedTime = `${appointment.hour}h${appointment.minutes}`;
            const newFormattedDate = formatDateToString(newDate);
            const newFormattedTime = `${data.hour}h${data.minutes}`;

            // Récupérer client et membres
            let clientName: string;
            let clientEmail: string;

            if (data.type === "OWNER") {
                const owner = await prisma.owner.findUnique({ where: { id: data.client } })
                if (!owner) return status(404, { message: "Propriétaire introuvable" })
                clientName = `${owner.firstname} ${owner.lastname}`;
                clientEmail = owner.email;
            } else {
                const tenant = await prisma.tenant.findUnique({ where: { id: data.client } })
                if (!tenant) return status(404, { message: "Locataire introuvable" })
                clientName = `${tenant.firstname} ${tenant.lastname}`;
                clientEmail = tenant.email;
            }

            const teamMembers = await prisma.user.findMany({
                where: { id: { in: data.teamMembers } },
                select: { email: true, firstname: true, lastname: true }
            });

            await prisma.$transaction(async tx => {
                await tx.appointment.update({
                    where: { id: params.id },
                    data: { ownerId: null, tenantId: null }
                })

                await tx.appointment.update({
                    where: { id: params.id },
                    data: {
                        type: data.type,
                        date: data.date,
                        hour: data.hour,
                        minutes: data.minutes,
                        subject: data.subject,
                        address: data.address,
                        note: data.note,
                        teamMembers: {
                            set: data.teamMembers.map((teamMember) => ({ id: teamMember }))
                        },
                        ...(data.type === "OWNER" ? { ownerId: data.client } : { tenantId: data.client }),
                    },
                });
            })

            // Bloc date changée pour les mails
            const dateChangedBlock = dateChanged ? `
        <tr>
            <td colspan="2" style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Modification de la date</p>
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="font-size:14px;color:#ef4444;text-decoration:line-through;padding-right:12px;">
                            ${oldFormattedDate} à ${oldFormattedTime}
                        </td>
                        <td style="font-size:14px;color:#a1a1aa;padding-right:12px;">→</td>
                        <td style="font-size:14px;font-weight:600;color:#16a34a;">
                            ${newFormattedDate} à ${newFormattedTime}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>` : "";

            // ─── Mail client ───────────────────────────────────────────────
            await sendMail({
                from: { name: "Upside", address: process.env.EMAIL_USER as string },
                to: [clientEmail],
                subject: `Modification de votre rendez-vous du ${newFormattedDate} – Upside`,
                html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">Upside</p>
                            <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Rendez-vous modifié</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#ffffff;padding:40px;">
                            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong style="color:#18181b;">${clientName}</strong>,</p>
                            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#52525b;">
                                Votre rendez-vous a été modifié. Voici le récapitulatif mis à jour :
                            </p>

                            <!-- Carte RDV -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:0;overflow:hidden;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                                                    <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Objet</p>
                                                    <p style="margin:0;font-size:18px;font-weight:700;color:#18181b;">${data.subject}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0;">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:16px 20px;width:50%;border-right:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Date</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${newFormattedDate}</p>
                                                            </td>
                                                            <td style="padding:16px 20px;width:50%;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Heure</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${newFormattedTime}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Adresse</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${data.address}</p>
                                                            </td>
                                                        </tr>
                                                        ${dateChangedBlock}
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            ${data.note ? `<p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:#71717a;">${data.note}</p>` : ""}

                            <div style="border-top:1px solid #f4f4f5;padding-top:28px;">
                                <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service Client</p>
                                <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                            <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
            });

            // ─── Mail membres de l'équipe ──────────────────────────────────
            if (teamMembers.length > 0) {
                await sendMail({
                    from: { name: "Upside", address: process.env.EMAIL_USER as string },
                    to: teamMembers.map(m => m.email),
                    subject: `Rendez-vous modifié – ${data.subject} – ${newFormattedDate}`,
                    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">Upside</p>
                            <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Rendez-vous modifié</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#ffffff;padding:40px;">
                            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour,</p>
                            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#52525b;">
                                Un rendez-vous auquel vous êtes assigné(e) a été modifié. Voici le récapitulatif mis à jour :
                            </p>

                            <!-- Carte RDV -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:0;overflow:hidden;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                                                    <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Objet</p>
                                                    <p style="margin:0;font-size:18px;font-weight:700;color:#18181b;">${data.subject}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0;">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:16px 20px;width:50%;border-right:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Date</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${newFormattedDate}</p>
                                                            </td>
                                                            <td style="padding:16px 20px;width:50%;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Heure</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${newFormattedTime}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:16px 20px;border-top:1px solid #f0f0f0;border-right:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Client</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${clientName}</p>
                                                            </td>
                                                            <td style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Type</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${data.type === "OWNER" ? "Propriétaire" : "Locataire"}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                                                                <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Adresse</p>
                                                                <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${data.address}</p>
                                                            </td>
                                                        </tr>
                                                        ${dateChangedBlock}
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            ${data.note ? `
                            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
                                <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#92400e;">Note</p>
                                <p style="margin:0;font-size:14px;line-height:1.6;color:#78350f;">${data.note}</p>
                            </div>` : ""}

                            <div style="border-top:1px solid #f4f4f5;padding-top:28px;">
                                <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service Client</p>
                                <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                            <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
                });
            }

            return status(200, { message: "Rendez-vous mis à jour avec succès" })

        } catch (error) {
            console.log(error)
            return status(500, {
                message: "Erreur lors de la mise à jour du rendez-vous",
            });
        }
    }, { auth: true, body: request.body, params: request.paramsId })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "appointments", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const [appointment, reference] = await prisma.$transaction([
            prisma.appointment.findUnique({ where: { id } }),
            prisma.reference.findFirst()
        ])

        if (!appointment) return status(404, { message: "Rendez-vous non trouvé" });
        if (appointment.isDeleting) return status(400, { message: "Rendez-vous en cours de suppression" });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: appointment.id,
                    type: "APPOINTMENT",
                    state: "WAIT",
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }),
            prisma.appointment.update({
                where: { id: appointment.id },
                data: { isDeleting: true }
            })
        ]);
        return status(200, { message: `La suppression du rendez-vous est en attente de validation.` })
    }, { auth: true, params: request.paramsId })