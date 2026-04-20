import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
    isLoading?: boolean;
    children: ReactNode;
    fallback?: ReactNode;
    className?: string;
};

export default function Visibility({
    isLoading = false,
    children,
    fallback,
    className,
}: Props) {
    return (
        <div className={cn("relative", className)}>
            <div
                className={cn(
                    "transition-all duration-200",
                    isLoading
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none absolute inset-0"
                )}
            >
                {fallback}
            </div>
            <div
                className={cn(
                    "transition-all duration-200",
                    !isLoading
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                )}
            >
                {children}
            </div>
        </div>
    );
}