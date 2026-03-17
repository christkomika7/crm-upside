import { cors } from "@elysiajs/cors";
import { env } from "bun";


export const corsPlugin = cors({
    origin: env.CLIENT_URL!,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
});