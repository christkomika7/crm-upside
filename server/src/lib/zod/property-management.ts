import { z } from "zod"

export const propertyManagementSchema = z.object({
    building: z.string({ error: "Le bâtiment est requis." }).min(1, { message: "Le bâtiment est requis." }),
    unit: z.string({ error: "L'unité est requise." }).min(1, { message: "L'unité est requise." }),
    administrativeManagement: z.boolean(),
    technicalManagement: z.boolean(),
    services: z.array(z.string()).optional(),
    observation: z.string().optional(),
    start: z.date({ error: "La date de début est requise." }),
    end: z.date({ error: "La date de fin est requise." }),
    active: z.boolean(),
}).superRefine((data, ctx) => {

    if (!data.administrativeManagement && !data.technicalManagement) {
        ctx.addIssue({
            code: "custom",
            message: "Veuillez sélectionner au moins une valeur.",
            path: ["administrativeManagement"],
        });
    }

    if (data.start >= data.end) {
        ctx.addIssue({
            code: "custom",
            message: "La date de début doit être inférieure à la date de fin.",
            path: ["start"],
        });
    }

    if (data.end < data.start) {
        ctx.addIssue({
            code: "custom",
            message: "La date de fin doit être supérieure à la date de début.",
            path: ["end"],
        });
    }
});
export const personalServiceSchema = z.object({
    name: z.string({ error: "Le nom est requis." }),
})

export type PersonalServiceSchemaType = z.infer<typeof personalServiceSchema>;
export type PropertyManagementSchemaType = z.infer<typeof propertyManagementSchema>;