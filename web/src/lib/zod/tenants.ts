import { z } from "zod";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../constant";

export const tenantSchema = z.object({
    isPersonal: z.boolean(),
    isDiplomatic: z.boolean(),
    firstname: z.string().min(1, "Le prénom est requis."),
    lastname: z.string().min(1, "Le nom est requis."),
    company: z.string().optional(),
    phone: z.string().min(1, "Le numéro de téléphone est requis."),
    email: z.string().min(1, "L'adresse mail est requis."),
    address: z.string().min(1, "L'adresse est requise."),
    income: z.string().optional(),
    maritalStatus: z.string().optional(),
    bankInfo: z.string().min(1, "Les informations bancaires sont requises."),
    paymentMode: z.array(z.enum(["CASH", "BANK", "CHECK"], { error: "Le mode de paiement est requis." })).min(1, "Le mode de paiement est requis."),
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