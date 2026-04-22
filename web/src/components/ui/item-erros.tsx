import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";
import type { ItemSchemaType } from "@/lib/zod/item";

type ItemError = {
    id: string;
    type: "ITEM" | "UNIT";
    reference: string;
    description: string;
    price: number;
    quantity: number;
    hasTax: boolean;
    charges?: number | undefined;
    extraCharges?: number | undefined;
    start?: Date | undefined;
    end?: Date | undefined;
}

type ItemErrorsProps = {
    errors: ItemError | undefined;
    className?: string;
};

export function ItemErrors({ errors, className }: ItemErrorsProps) {
    if (!errors) return null;

    const entries = Object.entries(errors) as [keyof ItemSchemaType, { message?: string }][];
    const visible = entries.filter(([, err]) => !!err?.message);

    if (visible.length === 0) return null;

    return (
        <div
            className={cn(
                "rounded-lg border border-red-100 bg-red-50 px-3 py-2 space-y-1",
                className
            )}
        >
            {visible.map(([field, err]) => (
                <div key={field} className="flex items-center gap-1.5">
                    <AlertCircleIcon className="size-3.5 text-red-400 mt-px shrink-0" />
                    <p className="text-[11px] leading-tight text-red-500">
                        {err.message}
                    </p>
                </div>
            ))}
        </div>
    );
}