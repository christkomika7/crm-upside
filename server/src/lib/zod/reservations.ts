import { z } from "zod";

export const reservationSchema = z.object({
    prospect: z.string({ error: "Le nom du prospect est requis." }),
    contact: z.string({ error: "Le contact est requise." }),
    deposit: z.string({ error: "Le prix est requis." }),
    startDate: z.date({ error: "La date de début est requise." }),
    endDate: z.date({ error: "La date de début est requise." }),
});


export type ReservationSchemaType = z.infer<typeof reservationSchema>;