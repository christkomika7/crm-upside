import { z } from "zod";

export const invoiceSchema = z.object({
    client: z.string({ error: "Le client est requis." }),
    items: z.array(z.string({ error: "Les items sont requis." })).min(1, { message: "Au moins un item est requis." }),
    amount: z.string({ error: "Le montant est requis." }),
    vat: z.string({ error: "Le VAT est requis." }),
    discount: z.string({ error: "La réduction est requise." }),
    finalAmount: z.string({ error: "Le montant final est requis." }),
    invoiceNumber: z.string({ error: "Le numéro de facture est requis." }),
    note: z.string({ error: "La note est requise." }),
});


export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;