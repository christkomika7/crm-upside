import { toast } from "sonner";

type LoadingToastProps = {
    title: string;
    step: number;
    total: number;
    message: string;
};

function LoadingToastContent({ title, step, total, message }: LoadingToastProps) {
    const percent = Math.round((step / total) * 100);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>
                <span style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--muted-foreground)",
                    background: "hsl(var(--muted))",
                    borderRadius: 99,
                    padding: "2px 8px",
                }}>
                    {step} / {total}
                </span>
            </div>

            <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
                {message}
            </p>

            {/* Dots */}
            <div style={{ display: "flex", alignItems: "center" }}>
                {Array.from({ length: total }).map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: i < total - 1 ? 1 : "none" }}>
                        <div style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: i < step
                                ? "hsl(var(--foreground))"
                                : "hsl(var(--border))",
                            transition: "background 0.3s",
                        }} />
                        {i < total - 1 && (
                            <div style={{
                                flex: 1,
                                height: 1,
                                background: i < step - 1
                                    ? "hsl(var(--foreground))"
                                    : "hsl(var(--border))",
                                transition: "background 0.3s",
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div style={{
                height: 3,
                background: "hsl(var(--muted))",
                borderRadius: 99,
                overflow: "hidden",
            }}>
                <div style={{
                    height: "100%",
                    width: `${percent}%`,
                    background: "hsl(var(--foreground))",
                    borderRadius: 99,
                    transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                }} />
            </div>
        </div>
    );
}

export function showLoadingToast(id: string, props: LoadingToastProps) {
    toast.custom(
        () => <LoadingToastContent {...props} />,
        { id, duration: Infinity }
    );
}

export function dismissLoadingToast(id: string) {
    toast.dismiss(id);
}

export function errorLoadingToast(id: string, message: string) {
    toast.dismiss(id);
    toast.error(message);
}