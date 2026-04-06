import { z } from "zod";

export const appointmentSchema = z.object({
    type: z.enum(["OWNER", "TENANT"], { error: "Le type de client est requis." }),
    hour: z.string({ error: "L'heure est requise." }),
    minutes: z.string({ error: "Les minutes sont requises." }),
    client: z.string({ error: "Le client est requis." }),
    date: z.date({ error: "La date est requise." }),
    address: z.string({ error: "L'emplacement est requis." }),
    subject: z.string({ error: "Le sujet est requis." }),
    teamMembers: z.array(z.string()).min(1, { error: "Veuillez sélectionner un membre de l'équipe." }),
    note: z.string({ error: "La note est requise." }),
});


export type AppointmentSchemaType = z.infer<typeof appointmentSchema>;