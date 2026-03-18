import { z } from "zod";

export const reservationSchema = z.object({
    name: z.string({ error: "Le nom du prospect est requis." }),
    contact: z.string({ error: "Le contact est requise." }),
    price: z.string({ error: "Le prix est requis." }),
    start: z.date({ error: "La date de début est requise." }),
    end: z.date({ error: "La date de début est requise." }),
    unit: z.string({ error: "L'unité est requise." })
}).refine((data) => data.start.getTime() >= data.end.getDate(), {
    path: ['end'],
    error: "La date de fin doit être superieur à la date de début"
});;

export type ReservationSchemaType = z.infer<typeof reservationSchema>;