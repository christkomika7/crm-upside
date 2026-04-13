import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const accountingSchema = z.object({
    date: z.date({ error: "La date est requise." }),
    type: z.enum(["OWNER", "TENANT"], { error: "Le type est requis." }),
    paidFor: z.string().optional(),
    allocation: z.string().optional(),
    category: z.string({ error: "La catégorie est requise." }),
    source: z.string({ error: "La source est requise." }),
    nature: z.string({ error: "La nature première est requise." }),
    secondNature: z.string({ error: "La nature seconde est requise." }),
    thirdNature: z.string({ error: "La nature troisième est requise." }),
    amount: z.string({ error: "Le montant est requis." }),
    taxType: z.enum(["HT", "TTC"], { error: "La taxe est requise." }),
    paymentMode: z.string({ error: "Le mode de paiement est requis." }),
    checkNumber: z.string({ error: "Le numéro de chèque est requis." }),
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
})

export const categorySchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
})

export const sourceSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    paymentMethod: z.enum(["CASH", "BANK", "CHECK"]),
})

export const natureSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    category: z.string().min(1, { error: "La catégorie est requise." }),
})

export const secondNatureSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    nature: z.string().min(1, { error: "La nature est requise." }),
})

export const thirdNatureSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    secondNature: z.string().min(1, { error: "La seconde nature est requise." }),
})

export type AllocationSchemaType = z.infer<typeof allocationSchema>;
export type CategorySchemaType = z.infer<typeof categorySchema>;
export type SourceSchemaType = z.infer<typeof sourceSchema>;
export type NatureSchemaType = z.infer<typeof natureSchema>;
export type SecondNatureSchemaType = z.infer<typeof secondNatureSchema>;
export type ThirdNatureSchemaType = z.infer<typeof thirdNatureSchema>;

export type AccountingSchemaType = z.infer<typeof accountingSchema>;