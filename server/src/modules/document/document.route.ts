import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { formatDateToString, generateRef } from "../../lib/utils";
import request from "./type";
import { shareSchema } from "../../lib/zod/share";
import { AttachementProps, sendMail } from "../../lib/email";

export const documentRoutes = new Elysia({ prefix: "/document" })
    .use(authPlugin)
    .get("/:id", async ({ permission, status, query, params }) => {

        const [reference, taxes, note] = await prisma.$transaction([
            prisma.reference.findFirst(),
            prisma.tax.findMany({
                include: {
                    cumuls: true
                }
            }),
            prisma.note.findFirst()
        ]);

        switch (query.type) {
            case "INVOICE":
                if (!canAccess(permission, "invoicing", ['read'])) {
                    return status(403, { message: "Accès refusé" });
                }

                if (!params.id) return status(404, { message: "Identifiant de la facture invalide" })

                const invoice = await prisma.invoice.findUnique({
                    where: {
                        id: params.id
                    },
                    include: {
                        owner: true,
                        tenant: true,
                        items: true
                    }
                });

                if (!invoice) return status(404, { message: "Facture non trouvée." })
                return {
                    id: invoice?.id,
                    reference: generateRef(reference?.invoice, invoice.reference),
                    taxes,
                    discount: invoice.discount,
                    discountType: invoice.discountType,
                    amountType: invoice.hasTax ? "TTC" : "HT",
                    type: invoice.type,
                    issue: formatDateToString(invoice.start),
                    due: formatDateToString(invoice.end),
                    amount: invoice.price.toString(),
                    amountPaid: invoice.amountPaid.toString(),
                    status: invoice.status,
                    items: invoice.items,
                    note: invoice.note || note?.invoice || "Aucune note",
                    isDeleting: invoice.isDeleting,
                    upside: {
                        design: {
                            logo: "",
                            position: "MIDDLE",
                            size: "SMALL",
                            background: "#ECFDF5",
                            line: "#34D399",
                        },
                        client: {
                            name: invoice.type === "OWNER" ? `${invoice.owner?.firstname} ${invoice.owner?.lastname}` :
                                `${invoice.tenant?.firstname} ${invoice.tenant?.lastname}`,
                            company: invoice.type === "OWNER" ? `${invoice.owner?.company}` : `${invoice.tenant?.company}`,
                            email: invoice.type === "OWNER" ? invoice.owner?.email : invoice.tenant?.email,
                            address: invoice.type === "OWNER" ? invoice.owner?.address : invoice.tenant?.address
                        },
                        company: "Upside",
                        address: "Rue de l'indépendance",
                        city: "Libreville",
                        country: "Gabon",
                        bp: "BP 2789",
                        email: "contact@upside.com",
                        website: "https://upside-gabon.com",
                        phone: "+241 01 44 00 00",
                        rccm: "GBLBR2022M12345",
                        nif: "0123456789"
                    },
                    createdAt: invoice.createdAt
                }
            case "QUOTE":
                if (!canAccess(permission, 'quotes', ['read'])) {
                    return status(403, { message: "Accès refusé" });
                }

                if (!params.id) return status(404, { message: "Identifiant du devis invalide." })

                const quote = await prisma.quote.findUnique({
                    where: {
                        id: params.id
                    },
                    include: {
                        owner: true,
                        tenant: true,
                        items: true
                    }
                });

                if (!quote) return status(404, { message: "Devis non trouvé." })

                return {
                    id: quote?.id,
                    reference: generateRef(reference?.quote, quote.reference),
                    type: quote.type,
                    issue: formatDateToString(quote.start),
                    discount: quote.discount,
                    discountType: quote.discountType,
                    amountType: quote.hasTax ? "TTC" : "HT",
                    due: formatDateToString(quote.end),
                    amount: quote.price.toString(),
                    isComplete: quote.isComplete,
                    items: quote.items,
                    note: quote.note || note?.invoice || "Aucune note",
                    isDeleting: quote.isDeleting,
                    upside: {
                        design: {
                            logo: "",
                            position: "MIDDLE",
                            size: "SMALL",
                            background: "#ECFDF5",
                            line: "#34D399",
                        },
                        client: {
                            name: quote.type === "OWNER" ? `${quote.owner?.firstname} ${quote.owner?.lastname}` :
                                `${quote.tenant?.firstname} ${quote.tenant?.lastname}`,
                            company: quote.type === "OWNER" ? `${quote.owner?.company}` : `${quote.tenant?.company}`,
                            email: quote.type === "OWNER" ? quote.owner?.email : quote.tenant?.email,
                            address: quote.type === "OWNER" ? quote.owner?.address : quote.tenant?.address
                        },
                        company: "Upside",
                        address: "Rue de l'indépendance",
                        city: "Libreville",
                        country: "Gabon",
                        bp: "BP 2789",
                        email: "contact@upside.com",
                        website: "https://upside-gabon.com",
                        phone: "+241 01 44 00 00",
                        rccm: "GBLBR2022M12345",
                        nif: "0123456789"
                    },
                    createdAt: quote.createdAt
                }

        }
    }, { auth: true, query: request.query, params: request.param })
    .post("/mail", async ({ permission, status, body }) => {

        switch (body.type) {
            case "INVOICE":
                if (!canAccess(permission, "invoicing", ["create", "update"])) {
                    return status(403, { message: "Accès refusé" });
                }
                break;
            case "QUOTE":
                if (!canAccess(permission, "quotes", ["create", "update"])) {
                    return status(403, { message: "Accès refusé" });
                }
                break;
        }

        const { success, data } = shareSchema.safeParse(body);

        if (!success) {
            return status(400, { message: "Données invalides" });
        }

        const prefix = await prisma.reference.findFirst();

        try {

            let reference: string;
            let price: number;
            let due: Date;
            let client: string;

            switch (data.type) {
                case "INVOICE":
                    const invoice = await prisma.invoice.findUnique({
                        where: {
                            id: data.id
                        },
                        select: {
                            reference: true,
                            price: true,
                            end: true,
                            type: true,
                            owner: {
                                select: {
                                    firstname: true,
                                    lastname: true
                                }
                            },
                            tenant: {
                                select: {
                                    firstname: true,
                                    lastname: true
                                }
                            }
                        }
                    });

                    if (!invoice) return status(404, { message: "Facture non trouvée" });
                    reference = generateRef(prefix?.invoice, invoice.reference);
                    price = invoice.price.toNumber();
                    due = invoice.end;
                    client = invoice.type === "OWNER" ?
                        `${invoice.owner?.firstname} ${invoice.owner?.lastname}` :
                        `${invoice.tenant?.firstname} ${invoice.tenant?.lastname}`;

                    break;
                case "QUOTE":
                    const quote = await prisma.quote.findUnique({
                        where: {
                            id: data.id
                        },
                        select: {
                            reference: true,
                            price: true,
                            end: true,
                            type: true,
                            owner: {
                                select: {
                                    firstname: true,
                                    lastname: true
                                }
                            },
                            tenant: {
                                select: {
                                    firstname: true,
                                    lastname: true
                                }
                            }
                        }
                    })

                    if (!quote) return status(404, { message: "Devis non trouvé" });
                    reference = generateRef(prefix?.quote, quote.reference);
                    price = quote.price.toNumber();
                    due = quote.end;
                    client = quote.type === "OWNER" ?
                        `${quote.owner?.firstname} ${quote.owner?.lastname}` :
                        `${quote.tenant?.firstname} ${quote.tenant?.lastname}`;
                    break;
            }

            const filename = `${data.type === "INVOICE" ? "Facture" : "Devis"} ${reference}.pdf`;
            const buffer = Buffer.from(await data.document!.arrayBuffer())
            const fileAttacments: AttachementProps[] = [];

            for (const uploadedFile of data.files ?? []) {
                const fileBuffer = await uploadedFile.arrayBuffer();
                const buffer = Buffer.from(fileBuffer);

                fileAttacments.push({
                    filename: uploadedFile.name || "Pièce jointe.pdf",
                    content: buffer,
                    contentType: 'application/pdf',
                });
            }

            const mailOptions = {
                from: {
                    name: "Upside",
                    address: process.env.EMAIL_USER as string,
                    contentType: 'application/pdf',
                },
                to: data.emails,
                subject: data.subject || `Votre ${data.type === "INVOICE" ? "facture" : "devis"} n° ${reference} – Upside`,
                html: data.message ?
                    `
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body
    style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                            <p
                                style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">
                                Upside</p>
                            <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Service Comptabilité
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#ffffff;padding:40px;">
                            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong
                                    style="color:#18181b;">${client}</strong>,</p>
                            <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#52525b;">${data.message}</p>
                            <div style="border-top:1px solid #f4f4f5;padding-top:28px;margin-top:8px;">
                                <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service
                                    Comptabilité</p>
                                <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                            <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé
                                automatiquement, merci de ne pas y répondre directement.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>`
                    :
                    `
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body
    style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#18181b;border-radius:16px 16px 0 0;padding:32px 40px;">
                            <p
                                style="margin:0;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#71717a;">
                                Upside</p>
                            <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Service Comptabilité
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#ffffff;padding:40px;">
                            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;">Bonjour <strong
                                    style="color:#18181b;">${client}</strong>,</p>
                            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#52525b;">
                                Veuillez trouver ci-joint votre facture accompagnant ce message.
                            </p>

                            <!-- Carte facture -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td
                                        style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:0;overflow:hidden;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <!-- Ligne référence -->
                                            <tr>
                                                <td style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                                                    <p
                                                        style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">
                                                        Référence</p>
                                                    <p style="margin:0;font-size:18px;font-weight:700;color:#18181b;">
                                                        Facture n° ${reference}</p>
                                                </td>
                                            </tr>
                                            <!-- Ligne montant + échéance -->
                                            <tr>
                                                <td style="padding:0;">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td
                                                                style="padding:16px 20px;width:50%;border-right:1px solid #f0f0f0;">
                                                                <p
                                                                    style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">
                                                                    Montant</p>
                                                                <p
                                                                    style="margin:0;font-size:16px;font-weight:700;color:#16a34a;">
                                                                    ${price.toLocaleString("fr-FR")} FCFA</p>
                                                            </td>
                                                            <td style="padding:16px 20px;width:50%;">
                                                                <p
                                                                    style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a1a1aa;">
                                                                    Échéance</p>
                                                                <p
                                                                    style="margin:0;font-size:15px;font-weight:600;color:#18181b;">
                                                                    ${formatDateToString(new Date(due))}</p>
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
                                Merci d'effectuer le règlement avant la date d'échéance indiquée ci-dessus, conformément
                                aux conditions précisées sur la facture. Pour toute question, notre équipe reste à votre
                                disposition.
                            </p>

                            <div style="border-top:1px solid #f4f4f5;padding-top:28px;">
                                <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa;">Cordialement,</p>
                                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#18181b;">Service
                                    Comptabilité</p>
                                <p style="margin:0 0 2px;font-size:13px;color:#71717a;">Upside</p>
                                <p style="margin:0;font-size:13px;color:#71717a;">+225 07 00 00 00 00</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="background:#fafafa;border-top:1px solid #f4f4f5;border-radius:0 0 16px 16px;padding:20px 40px;">
                            <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">Cet email a été envoyé
                                automatiquement, merci de ne pas y répondre directement.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>`,
                attachments: [
                    {
                        filename,
                        content: buffer,
                        contentType: 'application/pdf',
                    },
                    ...fileAttacments,
                ]
            }

            await sendMail(mailOptions);

        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email:", error);
            return status(500, { message: "Erreur lors de l'envoi de l'email" });
        }

    }, {
        auth: true,
        body: request.body
    });