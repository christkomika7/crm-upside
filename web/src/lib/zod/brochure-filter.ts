import { z } from "zod";

export const brochureFilterSchema = z.object({
    type: z.string().optional(),
    location: z.string().optional(),
    rooms: z.string().optional(),
    parking: z.boolean(),
    furnished: z.boolean(),
    wifi: z.boolean(),
    vacant: z.boolean(),
});

export type BrochureFilterSchemaType = z.infer<typeof brochureFilterSchema>;