import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const incomeAccountingSchema = z.object({
    date: z.date({ error: "La date est requise." }),
    allocation: z.string().optional(),
    category: z.string().min(1, { error: "La catégorie est requise." }),
    source: z.string().min(1, { error: "La source est requise." }),
    nature: z.string().min(1, { error: "La nature première est requise." }),
    secondNature: z.string().optional(),
    thirdNature: z.string().optional(),
    amount: z.string().min(1, { error: "Le montant est requis." }),
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
    category: z.string().min(1, { error: "La catégorie est requise." }),
    source: z.string().min(1, { error: "La source est requise." }),
    nature: z.string().min(1, { error: "La nature première est requise." }),
    secondNature: z.string().optional(),
    thirdNature: z.string().optional(),
    amount: z.string().min(1, { error: "Le montant est requis." }),
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


export const allocationSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    accountingType: z.enum(["INFLOW", "OUTFLOW"]),
})

export const categorySchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    accountingType: z.enum(["INFLOW", "OUTFLOW"]),
})

export const sourceSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    paymentMethod: z.enum(["CASH", "BANK", "CHECK"]),
    accountingType: z.enum(["INFLOW", "OUTFLOW"]),
})

export const natureSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    category: z.string().min(1, { error: "La catégorie est requise." }),
    accountingType: z.enum(["INFLOW", "OUTFLOW"]),
})

export const secondNatureSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    nature: z.string().min(1, { error: "La nature est requise." }),
    accountingType: z.enum(["INFLOW", "OUTFLOW"]),
})

export const thirdNatureSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    secondNature: z.string().min(1, { error: "La seconde nature est requise." }),
    accountingType: z.enum(["INFLOW", "OUTFLOW"]),
})

export type AllocationSchemaType = z.infer<typeof allocationSchema>;
export type CategorySchemaType = z.infer<typeof categorySchema>;
export type SourceSchemaType = z.infer<typeof sourceSchema>;
export type NatureSchemaType = z.infer<typeof natureSchema>;
export type SecondNatureSchemaType = z.infer<typeof secondNatureSchema>;
export type ThirdNatureSchemaType = z.infer<typeof thirdNatureSchema>;

export type IncomeAccountingSchemaType = z.infer<typeof incomeAccountingSchema>;
export type OutcomeAccountingSchemaType = z.infer<typeof outcomeAccountingSchema>;