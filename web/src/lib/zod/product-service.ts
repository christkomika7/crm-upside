import { z } from "zod";

export const productServiceSchema = z.object({
    reference: z.string().min(1, "La référence est requise"),
    description: z.string().min(1, "La description est requise"),
    hasTax: z.boolean(),
    price: z.string()
        .min(1, "Le prix est requis")
        .refine((val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        }, {
            message: "Le prix doit être supérieur à 0",
        }),
});

export type ProductServiceSchemaType = z.infer<typeof productServiceSchema>;
