import { cors } from "@elysiajs/cors";

const allowedOrigins = [
    "http://localhost:5173",
    "https://crm.upside-gabon.com"
];

export const corsPlugin = cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
});