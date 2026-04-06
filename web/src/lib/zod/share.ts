import { z } from "zod";

export const shareSchema = z.object({
    id: z.string({ error: "L'identifiant est requis" }),
    type: z.enum(["INVOICE", "QUOTE", "CONTRACT", "MANDATE"]),
    emails: z.array(z.email({ error: "Email invalide" })).min(1, "Au moins un email est requis"),
    subject: z.string().optional(),
    message: z.string().optional(),
    document: z.instanceof(Blob).optional(),
    files: z.array(z.instanceof(File)).optional()
}).superRefine((data, ctx) => {
    if ((data.type === "INVOICE" || data.type === "QUOTE") && !data.document) {
        ctx.addIssue({
            code: "custom",
            path: ["document"],
            message: "Le fichier est obligatoire pour une facture ou un devis."
        });
    }
});

export type ShareSchemaType = z.infer<typeof shareSchema>