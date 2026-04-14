import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const incomeAccountingSchema = z.object({
    date: z.date({ error: "La date est requise." }),
    allocation: z.string().optional(),
    category: z.string({ error: "La catégorie est requise." }),
    source: z.string({ error: "La source est requise." }),
    nature: z.string({ error: "La nature première est requise." }),
    secondNature: z.string().optional(),
    thirdNature: z.string().optional(),
    amount: z.string({ error: "Le montant est requis." }),
    taxType: z.enum(["HT", "TTC"], { error: "La taxe est requise." }),
    paymentMode: z.enum(["CASH", "CHECK", "BANK"], { error: "Le mode de paiement est requis." }),
    description: z.string({ error: "La description est requise." }).min(20, { error: "La description doit contenir au moins 20 caractères." }),
    documents: z.array(
        z
            .instanceof(File)
            .refine(
                (file) => ALLOWED_TYPES.includes(file.type), "Seuls les fichiers PDF et images sont autorisés"
            )
            .refine(
                (file) => file.size <= MAX_FILE_SIZE,
                "Chaque fichier ne doit pas dépasser 4 Mo"
            )
    ).optional(),
});

export const outcomeAccountingSchema = z.object({
    date: z.date({ error: "La date est requise." }),
    unit: z.string().optional(),
    period: z.date().optional(),
    allocation: z.string().optional(),
    category: z.string({ error: "La catégorie est requise." }),
    source: z.string({ error: "La source est requise." }),
    nature: z.string({ error: "La nature première est requise." }),
    secondNature: z.string().optional(),
    thirdNature: z.string().optional(),
    amount: z.string({ error: "Le montant est requis." }),
    taxType: z.enum(["HT", "TTC"], { error: "La taxe est requise." }),
    paymentMode: z.enum(["CASH", "CHECK", "BANK"], { error: "Le mode de paiement est requis." }),
    checkNumber: z.string().optional(),
    description: z.string({ error: "La description est requise." }).min(20, { error: "La description doit contenir au moins 20 caractères." }),
    documents: z.array(
        z
            .instanceof(File)
            .refine(
                (file) => ALLOWED_TYPES.includes(file.type), "Seuls les fichiers PDF et images sont autorisés"
            )
            .refine(
                (file) => file.size <= MAX_FILE_SIZE,
                "Chaque fichier ne doit pas dépasser 4 Mo"
            )
    ).optional(),
});

export type IncomeAccountingSchemaType = z.infer<typeof incomeAccountingSchema>;
export type OutcomeAccountingSchemaType = z.infer<typeof outcomeAccountingSchema>;