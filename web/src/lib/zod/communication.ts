import { z } from "zod";

export const communicationSchema = z.object({
    type: z.enum(["letter", "note"], { error: "Le type de communication est requis." }),
    recipient: z.string().min(1, { error: "Le destinataire est requis." }),
    building: z.string().min(1, { error: "Le bâtiment est requis." }),
    unit: z.string().min(1, { error: "L'unité est requise." }),
    message: z.string().min(1, { error: "Le message est requis." }),
});


export type CommunicationSchemaType = z.infer<typeof communicationSchema>;