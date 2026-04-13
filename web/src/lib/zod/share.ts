import { z } from "zod";

export const shareSchema = z.object({
    id: z.string({ error: "L'identifiant est requis" }),
    type: z.enum(["INVOICE", "QUOTE", "CONTRACT", "MANDATE", "PURCHASE_ORDER"]),
    emails: z.array(z.email({ error: "Email invalide" })).min(1, "Au moins un email est requis"),
    subject: z.string().optional(),
    message: z.string().optional(),
    document: z.instanceof(Blob).optional(),
    files: z.array(z.instanceof(File)).optional()
}).superRefine((data, ctx) => {
    if ((data.type === "INVOICE" || data.type === "QUOTE" || data.type === "PURCHASE_ORDER") && !data.document) {
        ctx.addIssue({
            code: "custom",
            path: ["document"],
            message: "Le fichier est obligatoire pour une facture ou un devis."
        });
    }
});

export const shareReportSchema = z.object({
    id: z.string({ error: "L'identifiant est requis" }),
    emails: z.array(z.email({ error: "Email invalide" })).min(1, "Au moins un email est requis"),
    subject: z.string().optional(),
    message: z.string().optional(),
    files: z.array(z.instanceof(File)).optional()
})

export type ShareReportSchemaType = z.infer<typeof shareReportSchema>
export type ShareSchemaType = z.infer<typeof shareSchema>