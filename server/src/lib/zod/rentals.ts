import { z } from "zod";

export const rentalSchema = z.object({
    tenant: z.string({ error: "Le nom du locataire est requis." }),
    building: z.string({ error: "Le nom du bâtiment est requis." }),
    unit: z.string({ error: "La valeur de l'unité est requise." }),
    price: z.string({ error: "Le prix est requis." }),
    start: z.date({ error: "La date de début est requise." }),
    end: z.date({ error: "La date de début est requise." }),
});


export type RentalSchemaType = z.infer<typeof rentalSchema>;