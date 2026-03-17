import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../../config/constant";

export const tenantSchema = z.object({
    firstname: z.string({ error: "Le prénom est requis." }),
    lastname: z.string({ error: "Le nom est requis." }),
    company: z.string({ error: "L'entreprise est requis." }),
    phone: z.string({ error: "Le numéro de téléphone est requis." }),
    email: z.string({ error: "L'adresse mail est requis." }),
    address: z.string({ error: "L'adresse est requise." }),
    income: z.string({ error: "Le prix est requis." }),
    bankInfo: z.string({ error: "Les informations bancaires sont requises." }),
    maritalStatus: z.string().optional(),
    paymentMode: z.string({ error: "Le mode de paiement est requis." }),
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


export type TenantSchemaType = z.infer<typeof tenantSchema>;