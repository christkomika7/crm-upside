import { z } from "zod";

export const itemSchema = z.object({
    id: z.string().min(1, { error: "L'identifiant est requis." }),
    type: z.enum(["ITEM", "UNIT"]),
    reference: z.string().min(1, { error: "La référence est requise." }),
    description: z.string().min(1, { error: "La description est requise." }),
    price: z.number().min(1, { error: "Le prix doit être supérieur à 0." }),
    quantity: z.number().min(1, { error: "La quantité doit être supérieure à 0." }),
    charges: z.number().optional(),
    extraCharges: z.number().optional(),
    start: z.date().optional(),
    end: z.date().optional(),
    hasTax: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.type === "UNIT") {
        if (!data.start || !data.end) {
            ctx.addIssue({
                path: ["start"],
                code: 'custom',
                message: "La période est requise.",
            });
        }

        if (data.charges === undefined) {
            ctx.addIssue({
                path: ["charges"],
                code: 'custom',
                message: "Les charges sont requises.",
            });
        }

        if (data.extraCharges === undefined) {
            ctx.addIssue({
                path: ["extraCharges"],
                code: 'custom',
                message: "Les charges supplémentaires sont requises.",
            });
        }
    }
});

export type ItemSchemaType = z.infer<typeof itemSchema>;
