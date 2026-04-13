import { useCallback } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { toast } from "sonner";
import { dismissLoadingToast, errorLoadingToast, showLoadingToast } from "./loading-toast";
import type { WsMessage } from "@/types/ws";

type NotificationProviderProps = {
    children: React.ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
    const handleMessage = useCallback((data: WsMessage) => {
        switch (data.type) {
            case "loading":
                showLoadingToast(data.id, {
                    title: data.title,
                    step: data.step,
                    total: data.total,
                    message: data.message,
                });
                break;
            case "loading-done":
                dismissLoadingToast(data.id);
                break;
            case "loading-error":
                errorLoadingToast(data.id, data.message);
                break;
            case "success":
                toast.success(data.message);
                break;
            case "error":
                toast.error(data.message);
                break;
            case "warning":
                toast.warning(data.message);
                break;
            case "info":
            default:
                toast.info(data.message);
                break;
        }
    }, []);

    useWebSocket({ onMessage: handleMessage });

    return <>{children}</>;
}