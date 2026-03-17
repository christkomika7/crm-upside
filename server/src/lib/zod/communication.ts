import { z } from "zod";

export const communicationSchema = z.object({
    type: z.enum(["letter", "note"], { error: "Le type de communication est requis." }),
    recipient: z.string({ error: "Le destinataire est requis." }),
    building: z.string({ error: "Le bâtiment est requis." }),
    unit: z.string({ error: "L'unité est requise." }),
    message: z.string({ error: "Le message est requis." }),
});


export type CommunicationSchemaType = z.infer<typeof communicationSchema>;