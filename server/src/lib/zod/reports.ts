import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../../config/constant";

export const reportSchema = z.object({
    date: z.string({ error: "La date est requise." }),
    tenant: z.string({ error: "Le nom du locataire est requis." }),
    unit: z.string({ error: "Veuillez selectionner une unité." }),
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