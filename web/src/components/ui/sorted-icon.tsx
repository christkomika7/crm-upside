import type { Column } from "@tanstack/react-table";
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

type SortIconProps<T> = {
    column: Column<T, unknown>;
}

export function SortIcon<T>({ column }: SortIconProps<T>) {
    const sorted = column.getIsSorted();
    if (sorted === "asc") return <ArrowUpIcon className="size-3.5 text-neutral-500" />;
    if (sorted === "desc") return <ArrowDownIcon className="size-3.5 text-neutral-500" />;
    return <ArrowUpDownIcon className="size-3.5 text-neutral-500" />;
};
