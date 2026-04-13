export type WsMessage =
    | { type: "success" | "error" | "warning" | "info"; message: string }
    | {
        type: "loading";
        id: string;
        title: string;
        step: number;
        total: number;
        message: string;
    }
    | { type: "loading-done"; id: string }
    | { type: "loading-error"; id: string; message: string };