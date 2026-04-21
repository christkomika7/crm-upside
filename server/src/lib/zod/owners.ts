import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const ownerSchema = z.object({
    buildings: z.array(z.string()).min(1, { error: "Minimum un bâtiment est requis." }),
    firstname: z.string().min(1, { error: "Le prénom est requis." }),
    lastname: z.string().min(1, { error: "Le nom est requis." }),
    company: z.string().optional(),
    phone: z.string().min(1, { error: "Le numéro de téléphone est requis." }),
    email: z.string().min(1, { error: "L'adresse mail est requis." }),
    address: z.string().min(1, { error: "L'adresse est requise." }),
    bankInfo: z.string().min(1, { error: "Les informations bancaires sont requises." }),
    actionnary: z.string().optional(),
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

export type OwnerSchemaType = z.infer<typeof ownerSchema>;