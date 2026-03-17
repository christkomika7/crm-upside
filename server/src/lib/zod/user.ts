import { z } from "zod";
import { Role } from "../../types/db";

export const userSchema = z.object({
    image: z.instanceof(File).optional(),
    firstname: z.string({ error: "Le prénom est requis" }),
    lastname: z.string({ error: "Le nom est requis" }),
    email: z.email({ error: "L'email est requis" }),
    password: z.string({ error: "Le mot de passe est requis" }).min(6, { error: "Le mot de passe doit contenir au moins 6 caractères" }),
    role: z.enum(Role, { error: "Le rôle est requis" }),
});

export const passwordSchema = z.object({
    password: z.string({ error: "Le mot de passe est requis" }),
    newPassword: z.string({ error: "Le mot de passe est requis" }).min(6, { error: "Le mot de passe doit contenir au moins 6 caractères" }),
});


export const emailSchema = z.object({
    email: z.email({ error: "L'email est requis" }),
    password: z.string({ error: "Le mot de passe est requis" }),
})

export type UserSchemaType = z.infer<typeof userSchema>;
export type PasswordSchemaType = z.infer<typeof passwordSchema>;
export type EmailSchemaType = z.infer<typeof emailSchema>;