import { z } from "zod";

export const itemSchema = z.object({
    id: z.string().min(1, { error: "L'identifiant est requis." }),
    reference: z.string().min(1, { error: "La référence est requise." }),
    description: z.string().min(1, { error: "La description est requise." }),
    price: z.number().min(1, { error: "Le prix doit être supérieur à 0." }),
    quantity: z.number().min(1, { error: "La quantité doit être supérieure à 0." }),
    hasTax: z.boolean(),
});

export type ItemSchemaType = z.infer<typeof itemSchema>;
