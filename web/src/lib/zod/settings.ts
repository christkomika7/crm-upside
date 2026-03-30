import { z } from "zod";

export const defaultTextSchema = z.object({
    invoice: z.string().optional(),
    quote: z.string().optional(),
});

export const taxCumulSchema = z.object({
    id: z.string(),
    name: z.string(),
    rate: z.string(),
});

export const taxSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    rate: z.string()
        .min(1, "Le taux est requis")
        .transform((val) => val.replace(/[\s\u00a0\u202f]/g, ""))
        .pipe(
            z.string().regex(
                /^-?\d+(\.\d+)?$/,
                "Le taux doit être un nombre valide (ex: -10, 19, 0.5, 19.12)"
            )
        ),
    cumul: z.array(taxCumulSchema).optional(),
});


export const noteSchema = z.object({
    invoice: z.string().optional(),
    quote: z.string().optional(),
});

export const referenceSchema = z.object({
    invoice: z.string().optional(),
    quote: z.string().optional(),
});

export type ReferenceSchemaType = z.infer<typeof referenceSchema>;
export type TaxSchemaType = z.infer<typeof taxSchema>;
export type DefaultTextSchemaType = z.infer<typeof defaultTextSchema>;
export type NoteSchemaType = z.infer<typeof noteSchema>;