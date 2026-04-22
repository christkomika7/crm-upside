import { z } from "zod";
import { itemSchema } from "./item";

export const invoiceSchema = z.object({
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { error: "Le prix doit être un nombre positif." }),
    discount: z.string().refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), { message: "La réduction doit être un nombre positif." }).optional(),
    discountType: z.enum(["PERCENT", "MONEY"]),
    period: z.string().optional(),
    hasTax: z.boolean(),
    type: z.enum(["OWNER", "TENANT"], { error: "Le type de client est requis." }),
    client: z.string().min(1, { error: "Le client est requis." }),
    items: z.array(itemSchema).min(1, { error: "Au moins un article est requis." }),
    start: z.date({ error: "La date d'émission de la facture est requise." }),
    end: z.string().min(1, { error: "L'échéance est requise." }),
    note: z.string().optional(),
})

export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;