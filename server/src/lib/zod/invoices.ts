import { z } from "zod";

export const itemSchema = z.object({
    id: z.string().min(1, { error: "L'identifiant est requis." }),
    reference: z.string().min(1, { error: "La référence est requise." }),
    description: z.string().min(1, { error: "La description est requise." }),
    price: z.number().min(1, { error: "Le prix doit être supérieur à 0." }),
    quantity: z.number().min(1, { error: "La quantité doit être supérieure à 0." }),
    hasTax: z.boolean(),
});


export const invoiceSchema = z.object({
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { error: "Le prix doit être un nombre positif." }),
    discount: z.string().refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), { message: "La réduction doit être un nombre positif." }).optional(),
    discountType: z.enum(["PERCENT", "MONEY"]),
    hasTax: z.boolean(),
    type: z.enum(["OWNER", "TENANT"], { error: "Le type de facture est requis." }),
    client: z.string({ error: "Le client est requis." }),
    items: z.array(itemSchema).min(1, { error: "Au moins un article est requis." }),
    start: z.date({ error: "La date d'émission de la facture est requise." }),
    end: z.date({ error: "La date d'échéance de la facture est requise." }),
    note: z.string().optional(),
}).refine((data) => data.start.getTime() <= data.end.getTime(), {
    error: "La date d'émission doit être inférieure à la date d'échéance.",
    path: ["start"],
}).superRefine((data, ctx) => {
    if (data.start && data.end && data.start > data.end) {
        ctx.addIssue({
            code: "custom",
            message: "La date d'émission doit être inférieure à la date d'échéance.",
            path: ["start"],
        });
        ctx.addIssue({
            code: "custom",
            message: "La date d'émission doit être inférieure à la date d'échéance.",
            path: ["end"],
        });
    }
});

export type ItemSchemaType = z.infer<typeof itemSchema>;
export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;