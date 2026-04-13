import Elysia, { t } from "elysia";

export const wsPlugin = new Elysia()
    .ws("/ws", {
        body: t.Object({
            type: t.String(),
            payload: t.Any(),
        }),
        open(ws) {
            ws.subscribe("notifications");
            console.log(`Client connecté: ${ws.id}`);
        },
        close(ws) {
            ws.unsubscribe("notifications");
            console.log(`Client déconnecté: ${ws.id}`);
        },
        message(ws, message) {
            console.log("Message reçu:", message);
        },
    });