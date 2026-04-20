import { z } from "zod";

export const appointmentSchema = z.object({
    type: z.enum(["OWNER", "TENANT"], { error: "Le type de client est requis." }),
    client: z.string().min(1, { error: "Le client est requis." }),
    date: z.date({ error: "La date est requise." }),
    hour: z.string().min(1, { error: "L'heure est requise." }),
    minutes: z.string().min(1, { error: "Les minutes sont requises." }),
    address: z.string().min(1, { error: "L'adresse est requise." }),
    subject: z.string().min(1, { error: "Le sujet est requis." }),
    teamMembers: z.array(z.string()).min(1, { error: "Veuillez sélectionner un membre de l'équipe." }),
    note: z.string().min(1, { error: "La note est requise." }),
});


export type AppointmentSchemaType = z.infer<typeof appointmentSchema>;