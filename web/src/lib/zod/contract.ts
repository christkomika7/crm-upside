import { z } from "zod";

export const contractSchema = z.object({
    type: z.enum(["CONTRACT", "MANDATE"], {
        error: "Le type de contrat est requis."
    }),
    rental: z
        .string({ error: "Location requise." })
        .min(1, { error: "Veuillez sélectionner une location." }),
    period: z
        .object({
            from: z.date({ error: "La date de début est requise." }),
            to: z.date({ error: "La date de fin est requise." }),
        }, { error: "La période est requise." })
        .refine(
            (period) => period.from instanceof Date && !isNaN(period.from.getTime()),
            {
                message: "La date de début est requise.",
                path: ["from"],
            }
        )
        .refine(
            (period) => period.to instanceof Date && !isNaN(period.to.getTime()),
            {
                message: "La date de fin est requise.",
                path: ["to"],
            }
        )
        .refine(
            (period) => period.from < period.to,
            {
                message: "La date de début doit être antérieure à la date de fin.",
                path: ["from"],
            }
        ),
})

export const mandateSchema = z.object({
    type: z.enum(["CONTRACT", "MANDATE"], {
        error: "Le type de contrat est requis."
    }),
    period: z
        .object({
            from: z.date({ error: "La date de début est requise." }),
            to: z.date({ error: "La date de fin est requise." }),
        }, { error: "La période est requise." })
        .refine(
            (period) => period.from instanceof Date && !isNaN(period.from.getTime()),
            {
                message: "La date de début est requise.",
                path: ["from"],
            }
        )
        .refine(
            (period) => period.to instanceof Date && !isNaN(period.to.getTime()),
            {
                message: "La date de fin est requise.",
                path: ["to"],
            }
        )
        .refine(
            (period) => period.from < period.to,
            {
                message: "La date de début doit être antérieure à la date de fin.",
                path: ["from"],
            }
        ),
    building: z.string().optional(),

})


export type ContractSchemaType = z.infer<typeof contractSchema>;
export type MandateSchemaType = z.infer<typeof mandateSchema>;