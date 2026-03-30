import { z } from "zod";

export const reservationSchema = z.object({
    name: z.string({ error: "Le nom du prospect est requis." }),
    contact: z.string({ error: "Le contact est requise." }),
    price: z.string({ error: "Le prix est requis." }),
    start: z.date({ error: "La date de début est requise." }),
    end: z.date({ error: "La date de début est requise." }),
    unit: z.string({ error: "L'unité est requise." })
}).superRefine((data, ctx) => {
    if (data.start && data.end && data.start > data.end) {
        ctx.addIssue({
            code: "custom",
            message: "La date de début doit être inférieure à la date de fin.",
            path: ["start"],
        });
        ctx.addIssue({
            code: "custom",
            message: "La date de fin doit être supérieure à la date de début.",
            path: ["end"],
        });
    }
});

export type ReservationSchemaType = z.infer<typeof reservationSchema>;