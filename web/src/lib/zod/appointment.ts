import { z } from "zod";

export const appointmentSchema = z.object({
    type: z.enum(["OWNER", "TENANT"], { error: "Le type de client est requis." }),
    client: z.string({ error: "Le client est requis." }),
    date: z.date({ error: "La date est requise." }),
    hour: z.string({ error: "L'heure est requis." }),
    minutes: z.string({ error: "Les minutes sont requises." }),
    address: z.string({ error: "L'adresse est requise." }),
    subject: z.string({ error: "Le sujet est requis." }),
    teamMembers: z.array(z.string()).min(1, { error: "Veuillez sélectionner un membre de l'équipe." }),
    note: z.string({ error: "La note est requise." }),
});


export type AppointmentSchemaType = z.infer<typeof appointmentSchema>;