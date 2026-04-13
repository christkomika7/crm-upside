import { SERVER_HOST } from "@/lib/host";
import { useEffect, useRef, useCallback } from "react";

type NotificationMessage = {
    type: "success" | "error" | "info" | "warning";
    message: string;
};

type UseWebSocketOptions = {
    onMessage: (data: NotificationMessage) => void;
    enabled?: boolean;
};

export function useWebSocket({ onMessage, enabled = true }: UseWebSocketOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>(3000);
    const isMounted = useRef(true);

    const connect = useCallback(() => {
        if (!enabled || !isMounted.current) return;

        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const host = SERVER_HOST.replace("http://", "").replace("https://", "");
        const ws = new WebSocket(`${protocol}://${host}/ws`);

        // console.log(ws);

        ws.onopen = () => {
            console.log("WebSocket connecté");
        };

        ws.onmessage = (event) => {
            try {
                const data: NotificationMessage = JSON.parse(event.data);
                onMessage(data);
            } catch {
                console.error("Erreur parsing message WS");
            }
        };

        ws.onclose = () => {
            console.log("WebSocket déconnecté, reconnexion dans 3s...");
            if (isMounted.current) {
                reconnectTimeout.current = setTimeout(connect, 3000);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket erreur:", error);
            ws.close();
        };

        wsRef.current = ws;
    }, [enabled, onMessage]);

    useEffect(() => {
        isMounted.current = true;
        connect();

        return () => {
            isMounted.current = false;
            clearTimeout(reconnectTimeout.current);
            wsRef.current?.close();
        };
    }, [connect]);
}