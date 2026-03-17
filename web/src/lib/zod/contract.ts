import { z } from "zod";


export const contractSchema = z.object({
    building: z.string({ error: "Le nom du bâtiment est requis." }),
    units: z.string({ error: "L'unité est requise." }),
    tenant: z.string({ error: "Le locataire est requis." }),
    price: z.string({ error: "Le prix est requis." }),
    managementFee: z.string({ error: "Les frais de gestion sont requis." }),
    startDate: z.date({ error: "La date de début est requise." }),
    duration: z.string({ error: "La durée du contrat est requise." }),
});

export const mandateSchema = z.object({
    building: z.string({ error: "Le nom du bâtiment est requis." }),
    owner: z.string({ error: "Le nom du propriétaire est requis." }),
    units: z.string({ error: "L'unité est requise." }),
    managementFee: z.string({ error: "Les frais de gestion sont requis." }),
    startDate: z.date({ error: "La date de début est requise." }),
    duration: z.string({ error: "La durée du contrat est requise." }),
});


export type ContractSchemaType = z.infer<typeof contractSchema>;
export type MandateSchemaType = z.infer<typeof mandateSchema>;