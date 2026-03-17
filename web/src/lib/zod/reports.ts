import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const reportSchema = z.object({
    tenant: z.string({ error: "Le nom du locataire est requis." }),
    propertyOrUnit: z.string({ error: "Veuillez selectionner une propriété ou une unité." }),
    size: z.string({ error: "La dimension est requise." }),
    livingRoom: z.string(),
    dining: z.string(),
    kitchen: z.string(),
    bedrooms: z.string(),
    bathrooms: z.string(),
    note: z.string().optional(),
    documents: z.array(
        z
            .instanceof(File)
            .refine(
                (file) => ALLOWED_TYPES.includes(file.type),
                "Seuls les fichiers PDF et images sont autorisés"
            )
            .refine(
                (file) => file.size <= MAX_FILE_SIZE,
                "Chaque fichier ne doit pas dépasser 4 Mo"
            )
    ).optional(),

});


export type ReportSchemaType = z.infer<typeof reportSchema>;