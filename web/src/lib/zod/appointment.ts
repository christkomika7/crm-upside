import { z } from "zod";

export const appointmentSchema = z.object({
    client: z.string({ error: "Le client est requis." }),
    date: z.date({ error: "La date est requise." }),
    location: z.string({ error: "L'emplacement est requis." }),
    subject: z.string({ error: "Le sujet est requis." }),
    note: z.string({ error: "La note est requise." }),
});


export type AppointmentSchemaType = z.infer<typeof appointmentSchema>;