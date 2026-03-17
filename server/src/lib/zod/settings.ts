import { z } from "zod";

export const defaultTextSchema = z.object({
    invoice: z.string().optional(),
    quote: z.string().optional(),
});

export const taxSchema = z.object({
    name: z.string(),
    rate: z.string()
        .regex(
            /^\d+(\.\d+)?$/,
            "Le taux doit être un nombre valide (ex: 1000, 0.5, 19.12)"
        ),
});

export const noteSchema = z.object({
    invoice: z.string().optional(),
    quote: z.string().optional(),
});

export const referenceSchema = z.object({
    owner: z.string().optional(),
    building: z.string().optional(),
    unit: z.string().optional(),
    rental: z.string().optional(),
    invoicing: z.string().optional(),
    contract: z.string().optional(),
    checkIn: z.string().optional(),
});

export type ReferenceSchemaType = z.infer<typeof referenceSchema>;
export type TaxSchemaType = z.infer<typeof taxSchema>;
export type DefaultTextSchemaType = z.infer<typeof defaultTextSchema>;
export type NoteSchemaType = z.infer<typeof noteSchema>;