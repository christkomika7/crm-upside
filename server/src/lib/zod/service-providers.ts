import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../../config/constant";

export const serviceProvidersSchema = z.object({
    firstname: z.string({ error: "Le prénom est requis." }),
    lastname: z.string({ error: "Le nom est requis." }),
    company: z.string({ error: "L'entreprise est requis." }),
    profession: z.string({ error: "La profession est requise." }),
    address: z.string({ error: "L'adresse est requise." }),
    companyContact: z.string({ error: "Le contact de l'entreprise est requis." }),
    phone: z.string({ error: "Le numéro de téléphone est requis." }),
    email: z.string({ error: "L'adresse mail est requis." }),
    taxId: z.string({ error: "Le numéro d'identification fiscal est requis." }),
    registerNumber: z.string({ error: "Le numéro d'enregistrement est requis." }),
    paymentTerms: z.string({ error: "Le terme de paiement est requis." }),
    rating: z.object({
        note: z.number().min(0).max(5, { message: "La note doit être comprise entre 0 et 5." }),
        comment: z.string().optional(),
    }),
    rccDocument: z.array(
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
    idCardDocument: z.array(
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
    taxCertificateDocument: z.array(
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


export type ServiceProvidersSchemaType = z.infer<typeof serviceProvidersSchema>;