import { z } from "zod";

export const paymentSchema = z.object({
    markAsPaid: z.boolean(),
    date: z.date({ error: "La date est requise." }),
    amount: z.string({ error: "La somme est requise." }),
    paymentMode: z.string({ error: "Le mode de paiement est requis." }),
    note: z.string().optional(),
});

export type PaymentSchemaType = z.infer<typeof paymentSchema>;