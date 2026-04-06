import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import request from "./type";
import Decimal from "decimal.js";
import { duration, formatDateToString } from "../../lib/utils";
import { contractSchema } from "../../lib/zod/contract";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { promisify } from "util";
import { exec } from "child_process";
import { randomUUID } from "crypto";
import { AttachementProps, sendMail } from "../../lib/email";
import { contractShareSchema } from "../../lib/zod/share";

const filePath = join(
    process.cwd(),
    "src",
    "templates",
    "template-contract.docx"
);

const execAsync = promisify(exec);

export const contractRoutes = new Elysia({ prefix: "/contract" })
    .use(authPlugin)
    .get("/stats", async ({ permission, status }) => {
        if (!canAccess(permission, "contracts", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const now = new Date();

            const [activeContracts, activeMandates, expired, canceled] = await Promise.all([
                prisma.contract.count({
                    where: {
                        type: "CONTRACT",
                        isCanceled: false,
                        start: { lte: now },
                        end: { gte: now },
                    },
                }),

                prisma.contract.count({
                    where: {
                        type: "MANDATE",
                        isCanceled: false,
                        start: { lte: now },
                        end: { gte: now },
                    },
                }),

                prisma.contract.count({
                    where: {
                        isCanceled: false,
                        end: { lt: now },
                    },
                }),

                prisma.contract.count({
                    where: {
                        isCanceled: true,
                    },
                }),
            ]);

            return status(200, {
                activeContracts,
                activeMandates,
                expired,
                canceled,
                total: activeContracts + activeMandates + expired + canceled,
            });

        } catch (error) {
            console.log(error);
            return status(500, {
                message: "Erreur lors de la récupération des statistiques.",
            });
        }
    }, { auth: true })
    .get("/", async ({ permission, status, query }) => {
        if (!canAccess(permission, "contracts", ['read'])) {
            return status(403, { message: "Accès refusé" });
        }

        const now = new Date();

        const whereClause =
            query.type === "WAIT"
                ? { start: { lte: now }, end: { gte: now } }
                : query.type === "ARCHIVED"
                    ? { end: { lt: now } }
                    : {};

        const contracts = await prisma.contract.findMany({
            where: whereClause,
            include: {
                building: {
                    include: {
                        units: true
                    }
                },
                rental: {
                    include: {
                        unit: true
                    }
                }
            }
        });

        return contracts.map((contract) => {
            const reference = contract.type === "CONTRACT" ? contract.rental?.unit.reference : contract.building?.name;
            let rent = contract.type === "CONTRACT" ?
                contract.rental?.price || new Decimal(0) :
                "-";
            const status = contract.isCanceled ? "CANCELLED" : contract.end < now ? "EXPIRED" : "ACTIVE";
            return {
                id: contract.id,
                reference,
                type: contract.type,
                isCanceled: contract.isCanceled,
                isDeleting: contract.isDeleting,
                status,
                issue: formatDateToString(contract.start),
                duration: duration(contract.start, contract.end),
                rent: rent.toString()
            }
        });
    }, { auth: true, query: request.queryType })
    .get("/disabled", async ({ query, permission, params, status }) => {
        if (!canAccess(permission, "contracts", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        const { type, reference } = query;

        if (!type || !reference) {
            return status(400, { message: "Type et référence requis." });
        }

        const contracts = await prisma.contract.findMany({
            where: {
                type,
                ...(type === "CONTRACT"
                    ? {
                        rental: {
                            id: reference,
                        },
                    }
                    : {
                        building: {
                            id: reference,
                        },
                    }),
            },
            select: {
                start: true,
                end: true,
            },
        });

        return contracts.map((c) => [
            c.start,
            c.end,
        ]);
    }, {
        auth: true,
        query: request.queryAction,
    })
    .get("/disabled/:id", async ({ query, permission, params, status }) => {
        if (!canAccess(permission, "contracts", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        const { type, reference } = query;
        const { id } = params;

        if (!type || !reference || !id) {
            return status(400, { message: "Type, référence et id requis." });
        }

        const contracts = await prisma.contract.findMany({
            where: {
                type,
                ...(type === "CONTRACT"
                    ? {
                        rental: {
                            id: reference,
                        },
                    }
                    : {
                        building: {
                            id: reference,
                        },
                    }),
            },
            select: {
                id: true,
                start: true,
                end: true,
            },
        });

        const disabled = contracts
            .filter((c) => c.id !== id)
            .map((c) => [c.start, c.end]);

        return disabled;
    }, {
        auth: true,
        params: request.paramsId,
        query: request.queryAction,
    })
    .get("/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "contracts", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        const contract = await prisma.contract.findUnique({
            where: { id: params.id },
            include: {
                building: { include: { units: true } },
                rental: { include: { unit: true } },
            },
        });

        if (!contract) {
            return status(404, { message: "Contrat introuvable." });
        }

        const reference =
            contract.type === "CONTRACT"
                ? contract.rental?.unit.reference
                : contract.building?.name;

        const contracts = await prisma.contract.findMany({
            where: {
                type: contract.type,
                ...(contract.type === "CONTRACT"
                    ? {
                        rental: {
                            unit: {
                                reference: reference,
                            },
                        },
                    }
                    : {
                        building: {
                            name: reference,
                        },
                    }),
            },
            select: {
                id: true,
                start: true,
                end: true,
            },
        });

        const disabled = contracts
            .filter((c) => c.id !== params.id)
            .map((c) => [new Date(c.start), new Date(c.end)]);

        return {
            ...contract,
            disabled,
        };
    }, {
        auth: true,
        params: request.paramsId,
    })
    .get('/template/:id', async ({ params, permission, status, set }) => {
        if (!canAccess(permission, 'contracts', ['read'])) {
            return status(403, { message: 'Accès refusé' })
        }

        const contract = await prisma.contract.findUnique({
            where: { id: params.id },
            include: {
                building: { include: { units: true } },
                rental: { include: { unit: true } },
            },
        })

        if (!contract) return status(404, { message: 'Contrat introuvable.' })
        if (contract.isDeleting) return status(400, { message: 'Ce contrat est en cours de suppression.' })

        const fileContent = await readFile(filePath)
        const zip = new PizZip(fileContent)
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

        const reference = contract.type === 'CONTRACT'
            ? contract.rental?.unit.reference
            : contract.building?.name


        try {
            doc.render({ reference: reference ?? 'N/A' })
            const resultBuffer = doc.getZip().generate({ type: 'nodebuffer' })

            const tmpDir = join("/tmp", randomUUID())
            const tmpDocx = join(tmpDir, "contract.docx")
            const tmpPdf = join(tmpDir, "contract.pdf")

            try {
                await mkdir(tmpDir, { recursive: true })
                await writeFile(tmpDocx, resultBuffer)

                await execAsync(
                    `libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${tmpDocx}"`
                )

                const pdfBuffer = await readFile(tmpPdf)
                const uint8Array = new Uint8Array(pdfBuffer)

                set.headers['content-type'] = 'application/pdf'
                set.headers['content-disposition'] = 'inline; filename=contrat.pdf'

                return new Response(uint8Array, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'inline; filename=contrat.pdf',
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
        if (!canAccess(permission, "contracts", ["read"])) {
            return status(403, { message: "Accès refusé" });
        }

        const exportType = (query.type ?? "PDF").toUpperCase() as "PDF" | "DOCX";

        const contract = await prisma.contract.findUnique({
            where: { id: params.id },
            include: {
                building: { include: { units: true } },
                rental: { include: { unit: true } },
            },
        });

        if (!contract) return status(404, { message: "Contrat introuvable." });
        if (contract.isDeleting) return status(400, { message: "Ce contrat est en cours de suppression." });

        const fileContent = await readFile(filePath);
        const zip = new PizZip(fileContent);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        const reference =
            contract.type === "CONTRACT"
                ? contract.rental?.unit.reference
                : contract.building?.name;

        try {
            doc.render({ reference: reference ?? "N/A" });
            const resultBuffer = doc.getZip().generate({ type: "nodebuffer" });
            const filename = `Contrat_${reference ?? params.id}`;

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
            const tmpDocx = join(tmpDir, "contract.docx");
            const tmpPdf = join(tmpDir, "contract.pdf");

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
    .put("/cancel/:id", async ({ params, permission, status }) => {
        if (!canAccess(permission, "contracts", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        try {
            const contract = await prisma.contract.findUnique({
                where: { id: params.id },
            });

            if (!contract) {
                return status(404, { message: "Contrat introuvable." });
            }

            if (contract.isCanceled) {
                return status(400, {
                    message: "Ce contrat est déjà résilié.",
                });
            }

            await prisma.contract.update({
                where: { id: params.id },
                data: {
                    isCanceled: true,
                },
            });

            return status(200, {
                message: "Contrat résilié avec succès.",
            });

        } catch (error) {
            console.log(error);
            return status(500, {
                message: "Erreur lors de la résiliation du contrat.",
            });
        }
    }, { auth: true })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "contracts", ['create'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = contractSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Les données insérées sont invalides." });
        }

        try {
            const overlappingContract = await prisma.contract.findFirst({
                where: {
                    ...(data.type === "CONTRACT"
                        ? { rentalId: data.rental }
                        : { buildingId: data.building }
                    ),
                    AND: [
                        {
                            start: {
                                lte: data.period.to,
                            },
                        },
                        {
                            end: {
                                gte: data.period.from
                            },
                        },
                    ],
                },
            });

            if (overlappingContract) {
                return status(400, {
                    message: "Les dates du contrat se chevauchent avec un contrat existant.",
                });
            }

            await prisma.contract.create({
                data: {
                    type: data.type,
                    start: data.period.from,
                    end: data.period.to,
                    ...(data.type === "CONTRACT"
                        ? { rentalId: data.rental }
                        : { buildingId: data.building }),
                },
            });

            return status(201, {
                message: `${data.type === "CONTRACT" ? "Contrat" : "Mandat"} créé avec succès.`,
            });

        } catch (error) {
            console.log(error);
            return status(500, {
                message: `Erreur lors de la création du ${data.type === "CONTRACT" ? "Contrat" : "Mandat"}`,
            });
        }
    }, { auth: true, body: request.body })
    .post("/mail", async ({ permission, status, body }) => {

        if (!canAccess(permission, "contracts", ["create", "update"])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = contractShareSchema.safeParse(body);
        if (!success) {
            return status(400, { message: "Données invalides" });
        }

        const contract = await prisma.contract.findUnique({
            where: { id: data.id },
            include: {
                building: { include: { units: true } },
                rental: {
                    include: {
                        unit: true,
                        tenant: { select: { firstname: true, lastname: true, email: true } },
                    }
                },
            },
        });

        if (!contract) return status(404, { message: "Contrat introuvable" });
        if (contract.isDeleting) return status(400, { message: "Ce contrat est supprimé" });
        if (contract.isCanceled) return status(400, { message: "Ce contrat est résilié" });

        try {
            const reference = contract.type === "CONTRACT"
                ? contract.rental?.unit.reference
                : contract.building?.name;

            const isMandate = contract.type === "MANDATE";
            const docLabel = isMandate ? "mandat" : "contrat";
            const filename = `${isMandate ? "Mandat" : "Contrat"} ${reference ?? contract.id}.pdf`;

            const fileContent = await readFile(filePath);
            const zip = new PizZip(fileContent);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

            try {
                doc.render({ reference: reference ?? "N/A" });
                const resultBuffer = doc.getZip().generate({ type: "nodebuffer" });

                const tmpDir = join("/tmp", randomUUID());
                const tmpDocx = join(tmpDir, "contract.docx");
                const tmpPdf = join(tmpDir, "contract.pdf");

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

                const client = contract.rental?.tenant
                    ? `${contract.rental.tenant.firstname} ${contract.rental.tenant.lastname}`
                    : reference ?? "Client";

                const startDate = new Date(contract.start).toLocaleDateString("fr-FR", {
                    year: "numeric", month: "long", day: "numeric"
                });
                const endDate = new Date(contract.end).toLocaleDateString("fr-FR", {
                    year: "numeric", month: "long", day: "numeric"
                });

                const mailOptions = {
                    from: {
                        name: "Upside",
                        address: process.env.EMAIL_USER as string,
                    },
                    to: data.emails,
                    subject: data.subject || `Votre ${docLabel} – ${reference} – Upside`,
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
                                    <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong style="color:#18181b;">${client}</strong>,</p>
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
                                    <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong style="color:#18181b;">${client}</strong>,</p>
                                    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#52525b;">
                                        Veuillez trouver ci-joint votre ${docLabel} accompagnant ce message.
                                    </p>
    
                                    <!-- Carte contrat -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                        <tr>
                                            <td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:0;overflow:hidden;">
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                                                            <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Référence</p>
                                                            <p style="margin:0;font-size:18px;font-weight:700;color:#18181b;">${isMandate ? "Mandat" : "Contrat"} – ${reference}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:0;">
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td style="padding:16px 20px;width:50%;border-right:1px solid #f0f0f0;">
                                                                        <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Début</p>
                                                                        <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${startDate}</p>
                                                                    </td>
                                                                    <td style="padding:16px 20px;width:50%;">
                                                                        <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">Fin</p>
                                                                        <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${endDate}</p>
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
        if (!canAccess(permission, "contracts", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const { success, data } = contractSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Les données sont invalides." });
        }

        try {
            const existing = await prisma.contract.findUnique({
                where: { id: params.id },
            });

            if (!existing) {
                return status(404, { message: "Contrat introuvable." });
            }

            if (
                existing.start.getTime() === new Date(data.period.from).getTime() &&
                existing.end.getTime() === new Date(data.period.to).getTime()
            ) {
                return status(400, {
                    message: "Aucune modification détectée sur les dates.",
                });
            }

            const overlappingContract = await prisma.contract.findFirst({
                where: {
                    id: { not: params.id },

                    ...(data.type === "CONTRACT"
                        ? { rentalId: data.rental }
                        : { buildingId: data.building }
                    ),

                    AND: [
                        {
                            start: {
                                lte: data.period.to,
                            },
                        },
                        {
                            end: {
                                gte: data.period.from,
                            },
                        },
                    ],
                },
            });

            if (overlappingContract) {
                return status(400, {
                    message: "Les dates se chevauchent avec un autre contrat existant.",
                });
            }

            await prisma.$transaction([
                prisma.contract.update({
                    where: { id: params.id },
                    data: {
                        type: data.type,
                        start: data.period.from,
                        end: data.period.to,
                        ...(data.type === "CONTRACT"
                            ? {
                                rentalId: data.rental,
                                buildingId: null,
                            }
                            : {
                                buildingId: data.building,
                                rentalId: null,
                            }),
                    },
                })
            ]);


            return status(200, {
                message: `${data.type === "CONTRACT" ? "Contrat" : "Mandat"} modifié avec succès.`,
            });

        } catch (error) {
            console.log(error);
            return status(500, {
                message: `Erreur lors de la modification du ${data.type === "CONTRACT" ? "Contrat" : "Mandat"}`,
            });
        }
    }, { auth: true, body: request.body, params: request.paramsId })
    .delete("/:id", async ({ params, permission, status, user }) => {
        if (!canAccess(permission, "contracts", ['update'])) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const contract = await prisma.contract.findUnique({ where: { id } })

        if (!contract) return status(404, { message: "Contrat non trouvé" });
        if (contract.isDeleting) return status(400, { message: "Contrat en cours de suppression" });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: contract.id,
                    type: "CONTRACT",
                    state: "WAIT",
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }),
            prisma.contract.update({
                where: { id: contract.id },
                data: { isDeleting: true }
            })
        ]);
        return status(200, { message: `La suppression du contrat est en attente de validation.` })
    }, { auth: true, params: request.paramsId })

