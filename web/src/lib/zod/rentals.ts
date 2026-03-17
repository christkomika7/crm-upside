import { z } from "zod";

export const rentalSchema = z.object({
    tenant: z.string({ error: "Le nom du locataire est requis." }),
    building: z.string({ error: "Le nom du bâtiment est requis." }),
    unit: z.string({ error: "La valeur de l'unité est requise." }),
    price: z.string({ error: "Le prix est requis." }),
    start: z.date({ error: "La date de début est requise." }),
    end: z.date({ error: "La date de début est requise." }),
}).refine((data) => data.start.getTime() >= data.end.getDate(), {
    path: ['end'],
    error: "La date de fin doit être superieur à la date de début"
}
);

export type RentalSchemaType = z.infer<typeof rentalSchema>;