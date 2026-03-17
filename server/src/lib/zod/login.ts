import { z } from "zod";

export const loginSchema = z.object({
    email: z.string({
        error: (data) => {
            if (data.input === "") {
                return "L'adresse e-mail est requise";
            }
            if (typeof data.input === "string" && !data.input.includes("@")) {
                return "L'adresse e-mail n'est pas valide";
            }
            return "Adresse e-mail invalide";
        }
    }),
    password: z.string({
        error: (data) => {
            if (data.input === "") {
                return "Le mot de passe est requis";
            }
            return "Mot de passe invalide";
        }
    }).min(8, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginSchema = z.infer<typeof loginSchema>;