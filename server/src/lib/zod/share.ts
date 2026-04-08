import { z } from "zod";

export const shareSchema = z.object({
    id: z.string({ error: "L'identifiant est requis" }),
    type: z.enum(["INVOICE", "QUOTE", "PURCHASE_ORDER"]),
    emails: z.array(z.email({ error: "Email invalide" })).min(1, "Au moins un email est requis"),
    subject: z.string().optional(),
    message: z.string().optional(),
    document: z.instanceof(Blob, {
        error: "Le fichier à envoyer est obligatoire."
    }),
    files: z.array(z.instanceof(File)).optional()
})


export const contractShareSchema = z.object({
    id: z.string({ error: "L'identifiant est requis" }),
    type: z.enum(["CONTRACT", "MANDATE"]),
    emails: z.array(z.email({ error: "Email invalide" })).min(1, "Au moins un email est requis"),
    subject: z.string().optional(),
    message: z.string().optional(),
    files: z.array(z.instanceof(File)).optional()
})

export const checkInOutShareSchema = z.object({
    id: z.string({ error: "L'identifiant est requis" }),
    emails: z.array(z.email({ error: "Email invalide" })).min(1, "Au moins un email est requis"),
    subject: z.string().optional(),
    message: z.string().optional(),
    files: z.array(z.instanceof(File)).optional()
})

export type ShareSchemaType = z.infer<typeof shareSchema>