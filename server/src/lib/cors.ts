import { cors } from "@elysiajs/cors";

const allowedOrigins = [
    "http://localhost:5173",
    "https://crm.upside-gabon.com"
];

export const corsPlugin = cors({
    // origin: "http://localhost:5173",
    origin: "https://crm.upside-gabon.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});