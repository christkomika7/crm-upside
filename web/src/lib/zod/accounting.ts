import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const accountingSchema = z.object({
    date: z.date({ error: "La date est requise." }),
    type: z.string({ error: "Le type est requis." }),
    paidFor: z.string().optional(),
    allocation: z.string().optional(),
    category: z.string({ error: "La catégorie est requise." }),
    firstNature: z.string({ error: "La nature première est requise." }),
    secondNature: z.string({ error: "La nature seconde est requise." }),
    thirdNature: z.string({ error: "La nature troisième est requise." }),
    amount: z.string({ error: "Le montant est requis." }),
    tax: z.string({ error: "La taxe est requise." }),
    method: z.string({ error: "Le mode de paiement est requis." }),
    reference: z.string({ error: "La référence est requise." }),
    checkNumber: z.string({ error: "Le numéro de chèque est requis." }),
    description: z.string({ error: "La description est requise." }),
    comment: z.string({ error: "Le commentaire est requis." }),
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

export type AccountingSchemaType = z.infer<typeof accountingSchema>;