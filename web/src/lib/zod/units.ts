import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const unitSchema = z.object({
    type: z.string({ error: "Le type est requis." }),
    reference: z.string({ error: "La référence est requise." }),
    building: z.string({ error: "Veuillez selectionner le bâtiment" }),
    rentalStatus: z.string({ error: "Le statut de la location est requis." }),
    surface: z.number({ error: "La surface est requise." }),
    livingroom: z.number({ error: "Le nombre de salon est requis." }),
    rent: z.number({ error: "Le prix de la location est requis." }),
    dining: z.number({ error: "Le nombre de salle à manger est requis." }),
    kitchen: z.number({ error: "Le nombre de cuisine est requis." }),
    bedroom: z.number({ error: "Le nombre de chambre est requis." }),
    bathroom: z.number({ error: "Le nombre de salle de bain est requis." }),
    furnished: z.string({ error: "Le statut de la location est requis." }),
    wifi: z.boolean(),
    water: z.boolean(),
    electricity: z.boolean(),
    tv: z.boolean(),
    charges: z.string({ error: "Le prix des charges est requis." }),
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

export const typeSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
})

export type TypeSchemaType = z.infer<typeof typeSchema>;
export type UnitSchemaType = z.infer<typeof unitSchema>;