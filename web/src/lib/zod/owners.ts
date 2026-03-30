import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const ownerSchema = z.object({
    buildings: z.array(z.string()).min(1, { error: "Minimum un bâtiment est requis." }),
    reference: z.string({ error: "La référence est requise." }),
    firstname: z.string({ error: "Le prénom est requis." }),
    lastname: z.string({ error: "Le nom est requis." }),
    company: z.string({ error: "L'entreprise est requis." }),
    phone: z.string({ error: "Le numéro de téléphone est requis." }),
    email: z.string({ error: "L'adresse mail est requis." }),
    address: z.string({ error: "L'adresse est requise." }),
    bankInfo: z.string({ error: "Les informations bancaires sont requises." }),
    actionnary: z.string({ error: "L'actionnaire est requis." }),
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