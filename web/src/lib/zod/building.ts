import { z } from "zod";
import { ALLOWED_IMAGES, ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const buildingSchema = z.object({
    name: z.string().min(1, { error: "Le nom est requis." }),
    reference: z.string().min(1, { error: "La référence est requise." }),
    location: z.string().min(1, { error: "L'adresse est requis." }),
    constructionDate: z.date({ error: "La date de construction est requise." }),
    lotType: z.array(z.string({ error: "Le type de lot est requis." })).min(1, { message: "Minimum un type de lot est requis." }),
    elevator: z.boolean(),
    parking: z.boolean(),
    security: z.boolean(),
    camera: z.boolean(),
    pool: z.boolean(),
    generator: z.boolean(),
    waterBorehole: z.boolean(),
    gym: z.boolean(),
    garden: z.boolean(),
    status: z.array(z.string()).min(1, { error: "Veuillez sélectionner au moins un statut" }),
    map: z.string().min(1, { error: "La map est requise." }),
    photos: z.array(
        z
            .instanceof(File)
            .refine(
                (file) => ALLOWED_IMAGES.includes(file.type),
                "Seuls les fichiers PDF et images sont autorisés"
            )
            .refine(
                (file) => file.size <= MAX_FILE_SIZE,
                "Chaque fichier ne doit pas dépasser 4 Mo"
            )
    ).optional(),
    deeds: z.array(
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

export const lotTypeSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
})

export type LotTypeSchemaType = z.infer<typeof lotTypeSchema>;
export type BuildingSchemaType = z.infer<typeof buildingSchema>;