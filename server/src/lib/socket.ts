import { Elysia } from "elysia";

export const wsPlugin = new Elysia()
    .ws("/ws", {
        open(ws) {
            console.log("Client connecté au websocket");
        },

        close() {
            console.log("Client déconnecté");
        }
    });