import { z } from "zod";

export const allocationSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
})

export const categorySchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
})

export const sourceSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
    paymentMethod: z.enum(["CASH", "BANK", "CHECK"]),
})

export const natureSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
    category: z.string({ error: "La catégorie est requise." }),
})

export const secondNatureSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
    nature: z.string({ error: "La nature est requise." }),
})

export const thirdNatureSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
    secondNature: z.string({ error: "La seconde nature est requise." }),
})

export type AllocationSchemaType = z.infer<typeof allocationSchema>;
export type CategorySchemaType = z.infer<typeof categorySchema>;
export type SourceSchemaType = z.infer<typeof sourceSchema>;
export type NatureSchemaType = z.infer<typeof natureSchema>;