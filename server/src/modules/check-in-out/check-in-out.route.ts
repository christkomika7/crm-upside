import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import { formatDateToString } from "../../lib/utils";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { promisify } from "util";
import { exec } from "child_process";
import { randomUUID } from "crypto";
import { AttachementProps, sendMail } from "../../lib/email";
import { checkInOutShareSchema } from "../../lib/zod/share";
import { reportSchema } from "../../lib/zod/reports";
import { deleteFile, uploadFiles } from "../../lib/storage";

const filePath = join(
    process.cwd(),
    "src",
    "templates",
    "template-check.docx"
);

const execAsync = promisify(exec);

export const checkInOutRoutes = new Elysia({ prefix: "/check-in-out" })
    .use(authPlugin)
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "checkInOutReports", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const now = new Date();

        const whereClause =
            query.type === "CHECK_IN"
                ? { isChecked: false }
                : query.type === "CHECK_OUT"
                    ? { isChecked: true }
                    : {};

        const checkInOuts = await prisma.checkInOut.findMany({
            where: whereClause,
            include: {
                tenant: true,
                unit: {
                    include: {
                        building: true
                    }
                },
            }
        });

        return checkInOuts.map((checkInOut) => {
            const status = checkInOut.isChecked ? "CHECKED_IN" : "CHECKED_OUT";
            return {
                id: checkInOut.id,
                date: formatDateToString(checkInOut.date),
                tenant: `${checkInOut.tenant.firstname} ${checkInOut.tenant.lastname}`,
                building: checkInOut.unit.building.name,
                unit: checkInOut.unit.reference,
                isChecked: checkInOut.isChecked,
                isDeleting: checkInOut.isDeleting,
                status,
            }
        });
    }, { auth: true, query: request.queryType })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "checkInOutReports", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        return await prisma.checkInOut.findUnique({
            where: { id: params.id },
        });
    }, {
        auth: true,
        params: request.paramsId,
    })
    .get('/template/:id', async ({ params, permission, status, set }) => {
        if (!canAccess(permission, 'checkInOutReports', ['read'])) {
            return status(403, { message: 'Accès refusé' })
        }

        const checkInOut = await prisma.checkInOut.findUnique({
            where: { id: params.id },
            include: {
                tenant: true,
                unit: {
                    include: {
                        building: true
                    }
                },
            },
        })

        if (!checkInOut) return status(404, { message: 'État des lieux introuvable.' })
        if (checkInOut.isDeleting) return status(400, { message: 'Cet état des lieux est en cours de suppression.' })

        const fileContent = await readFile(filePath)
        const zip = new PizZip(fileContent)
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

        const surface = `${checkInOut.unit.surface} m²`;


        try {
            doc.render({ surface })
            const resultBuffer = doc.getZip().generate({ type: 'nodebuffer' })

            const tmpDir = join("/tmp", randomUUID())
            const tmpDocx = join(tmpDir, "check-in-out.docx")
            const tmpPdf = join(tmpDir, "check-in-out.pdf")

            try {
                await mkdir(tmpDir, { recursive: true })
                await writeFile(tmpDocx, resultBuffer)

                await execAsync(
                    `libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${tmpDocx}"`
                )

                const pdfBuffer = await readFile(tmpPdf)
                const uint8Array = new Uint8Array(pdfBuffer)

                set.headers['content-type'] = 'application/pdf'
                set.headers['content-disposition'] = 'inline; filename=check-in-out.pdf'

                return new Response(uint8Array, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'inline; filename=check-in-out.pdf',
                    }
                })
            } catch (e) {
                console.error(e)
                return status(500, { message: 'Erreur conversion PDF' })
            } finally {
                await unlink(tmpDocx).catch(() => { })
                await unlink(tmpPdf).catch(() => { })
                await unlink(tmpDir).catch(() => { })
            }
        } catch (e) {
            console.error(e)
            return status(500, { message: 'Erreur génération document' })
        }

    }, { auth: true, params: request.paramsId })
    .get("/export/:id", async ({ params, query, permission, status, set }) => {
        if (!canAccess(permission, "checkInOutReports", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        const exportType = (query.type ?? "PDF").toUpperCase() as "PDF" | "DOCX";

        const checkInOut = await prisma.checkInOut.findUnique({
            where: { id: params.id },
            include: {
                tenant: true,
                unit: {
                    include: {
                        building: true
                    }
                },
            },
        });

        if (!checkInOut) return status(404, { message: "État des lieux introuvable." });
        if (checkInOut.isDeleting) return status(400, { message: "Cet état des lieux est en cours de suppression." });

        const fileContent = await readFile(filePath);
        const zip = new PizZip(fileContent);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        const surface = `${checkInOut.unit.surface} m²`;
        const unit = `${checkInOut.unit.reference}`;


        try {
            doc.render({ surface });
            const resultBuffer = doc.getZip().generate({ type: "nodebuffer" });
            const filename = `État des lieux ${unit ?? params.id}`;

            if (exportType === "DOCX") {
                const uint8Array = new Uint8Array(resultBuffer);
                return new Response(uint8Array, {
                    headers: {
                        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "Content-Disposition": `attachment; filename="${filename}.docx"`,
                    },
                });
            }

            const tmpDir = join("/tmp", randomUUID());
            const tmpDocx = join(tmpDir, "check-in-out.docx");
            const tmpPdf = join(tmpDir, "check-in-out.pdf");

            try {
                await mkdir(tmpDir, { recursive: true });
                await writeFile(tmpDocx, resultBuffer);
                await execAsync(`libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${tmpDocx}"`);

                const pdfBuffer = await readFile(tmpPdf);
                const uint8Array = new Uint8Array(pdfBuffer);

                return new Response(uint8Array, {
                    headers: {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
                    },
                });
            } catch (e) {
                console.error(e);
                return status(500, { message: "Erreur conversion PDF" });
            } finally {
                await unlink(tmpDocx).catch(() => { });
                await unlink(tmpPdf).catch(() => { });
                await unlink(tmpDir).catch(() => { });
            }
        } catch (e) {
            console.error(e);
            return status(500, { message: "Erreur génération document" });
        }


    }, {
        auth: true,
        params: request.paramsId,
        query: request.queryDocument
    })
    .put("/validate/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "checkInOutReports", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const checkInOut = await prisma.checkInOut.findUnique({
                where: { id: params.id },
            });

            if (!checkInOut) {
                return status(404, { message: "État des lieux introuvable." });
            }

            if (checkInOut.isChecked) {
                return status(400, {
                    message: "Cet état des lieux est déjà validé.",
                });
            }

            await prisma.checkInOut.update({
                where: { id: params.id },
                data: {
                    isChecked: true,
                },
            });

            return status(200, {
                message: "État des lieux validé avec succès.",
            });

        } catch (error) {
            console.log(error);
            return status(500, {
                message: "Erreur lors de la validation de l'état des lieux.",
            });
        }
    }, { auth: true })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "checkInOutReports", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = reportSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Les données insérées sont invalides." });
        }

        const uploadedKeys: string[] = [];

        try {

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.checkInOut.create({
                data: {
                    date: data.date,
                    tenantId: data.tenant,
                    unitId: data.unit,
                    note: data.note,
                    documents: documents,
                },
            });

            return status(201, {
                message: `État des lieux créé avec succès.`,
            });

        } catch (error) {
            console.log(error);

            await Promise.all(
                uploadedKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );

            return status(500, {
                message: `Erreur lors de la création de l'état des lieux`,
            });
        }
    }, { auth: true, body: request.body })
    .post("/mail", async ({ permission, status, body }) => {

        if (!canAccess(permission, "checkInOutReports", ["create", "update"])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = checkInOutShareSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Données invalides" });
        }

        const checkInOut = await prisma.checkInOut.findUnique({
            where: { id: data.id },
            include: {
                unit: { include: { building: true } },
                tenant: { select: { firstname: true, lastname: true, email: true } },
            },
        });

        if (!checkInOut) return status(404, { message: "État des lieux introuvable" });
        if (checkInOut.isChecked) return status(400, { message: "Cet état des lieux est déjà validé" });
        if (checkInOut.isDeleting) return status(400, { message: "Cet état des lieux est en cours de suppression" });

        try {
            const unit = checkInOut.unit.building.reference;
            const surface = checkInOut.unit.surface;
            const building = checkInOut.unit.building.name;
            const tenant = checkInOut.tenant.firstname + " " + checkInOut.tenant.lastname;
            const docLabel = "État des lieux";
            const filename = `${docLabel} ${unit}.pdf`;

            const fileContent = await readFile(filePath);
            const zip = new PizZip(fileContent);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

            try {
                doc.render({ surface });
                const resultBuffer = doc.getZip().generate({ type: "nodebuffer" });

                const tmpDir = join("/tmp", randomUUID());
                const tmpDocx = join(tmpDir, "check-in-out.docx");
                const tmpPdf = join(tmpDir, "check-in-out.pdf");

                let pdfBuffer: Buffer;

                try {
                    await mkdir(tmpDir, { recursive: true });
                    await writeFile(tmpDocx, resultBuffer);
                    await execAsync(
                        `libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${tmpDocx}"`
                    );
                    pdfBuffer = await readFile(tmpPdf);
                } finally {
                    await unlink(tmpDocx).catch(() => { });
                    await unlink(tmpPdf).catch(() => { });
                    await unlink(tmpDir).catch(() => { });
                }

                const fileAttachments: AttachementProps[] = [];
                for (const uploadedFile of data.files ?? []) {
                    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
                    fileAttachments.push({
                        filename: uploadedFile.name || "Pièce jointe",
                        content: fileBuffer,
                        contentType: "application/pdf",
                    });
                }

                const mailOptions = {
                    from: {
                        name: "Upside",
                        address: process.env.EMAIL_USER as string,
                    },
                    to: data.emails,
                    subject: data.subject || `Votre ${docLabel} – ${unit} – Upside`,
                    html: data.message
                        ? `
        <!DOCTYPE html>
        <html lang="fr">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
                <tr><td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                        <tr>
                            <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                                <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">Upside</p>
                                <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Service Gestion</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background:#ffffff;padding:40px;">
                                <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong style="color:#18181b;">${tenant}</strong>,</p>
                                <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#52525b;">${data.message}</p>
                                <div style="border-top:1px solid #f4f4f5;padding-top:28px;margin-top:8px;">
                                    <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                    <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service Gestion</p>
                                    <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                    <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                                <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>`
                        : `
        <!DOCTYPE html>
        <html lang="fr">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
                <tr><td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                        <tr>
                            <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                                <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">Upside</p>
                                <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Service Gestion</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background:#ffffff;padding:40px;">
                                <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong style="color:#18181b;">${tenant}</strong>,</p>
                                <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#52525b;">
                                    Veuillez trouver ci-joint votre ${docLabel} accompagnant ce message.
                                </p>

                                <!-- Carte état des lieux -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                    <tr>
                                        <td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:0;overflow:hidden;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                                                        <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Résidence</p>
                                                        <p style="margin:0;font-size:18px;font-weight:700;color:#18181b;">${building}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0;">
                                                        <table width="100%" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td style="padding:16px 20px;width:50%;border-right:1px solid #f0f0f0;">
                                                                    <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Unité</p>
                                                                    <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${unit}</p>
                                                                </td>
                                                                <td style="padding:16px 20px;width:50%;">
                                                                    <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Surface</p>
                                                                    <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${surface} m²</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:#71717a;">
                                    Veuillez prendre connaissance du document ci-joint et nous contacter pour toute question ou remarque. Notre équipe reste à votre disposition.
                                </p>

                                <div style="border-top:1px solid #f4f4f5;padding-top:28px;">
                                    <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                    <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service Gestion</p>
                                    <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                    <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                                <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>`,
                    attachments: [
                        {
                            filename,
                            content: pdfBuffer,
                            contentType: "application/pdf",
                        },
                        ...fileAttachments,
                    ],
                };

                await sendMail(mailOptions);
                return status(200, { message: "Email envoyé avec succès" });

            } catch (e) {
                console.error(e);
                return status(500, { message: "Erreur génération document" });
            }

        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email:", error);
            return status(500, { message: "Erreur lors de l'envoi de l'email" });
        }

    }, {
        auth: true,
        body: request.mailBody,
    })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "checkInOutReports", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = reportSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Les données sont invalides." });
        }

        const checkInOut = await prisma.checkInOut.findUnique({
            where: { id: params.id },
        });

        if (!checkInOut) {
            return status(404, { message: "État des lieux introuvable." });
        }
        const oldKeys = [...checkInOut.documents];

        const uploadedKeys: string[] = [];

        try {

            let documents: string[] = [];

            try {
                documents = await uploadFiles(uploadedKeys, data.documents);
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.$transaction([
                prisma.checkInOut.update({
                    where: { id: params.id },
                    data: {
                        date: data.date,
                        tenantId: data.tenant,
                        unitId: data.unit,
                        note: data.note,
                        documents: documents,
                    },
                })
            ]);

            await Promise.all(
                oldKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );


            return status(200, {
                message: `État des lieux modifié avec succès.`,
            });

        } catch (error) {
            console.log(error);
            await Promise.all(
                uploadedKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );
            return status(500, {
                message: `Erreur lors de la modification de l'état des lieux`,
            });
        }
    }, { auth: true, body: request.body, params: request.paramsId })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "checkInOutReports", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const checkInOut = await prisma.checkInOut.findUnique({ where: { id } })

        if (!checkInOut) return status(404, { message: "État des lieux introuvable" });
        if (checkInOut.isDeleting) return status(400, { message: "État des lieux en cours de suppression" });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: checkInOut.id,
                    type: "CHECK_IN",
                    state: "WAIT",
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }),
            prisma.checkInOut.update({
                where: { id: checkInOut.id },
                data: { isDeleting: true }
            })
        ]);
        return status(200, { message: `La suppression de l'état des lieux est en attente de validation.` })
    }, { auth: true, params: request.paramsId })

