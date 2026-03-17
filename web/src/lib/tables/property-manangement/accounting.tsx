import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, EyeIcon, FileDownIcon } from "lucide-react";
import {
    Status,
    StatusLabel,
} from "@/components/ui/status";
import { formatDateTo } from "@/lib/utils";
import ExportTo from "@/components/modal/export-to";


type KeyType = "id" | "date" | "type" | "description" | "amount" | "createdAt"

export const data: Record<KeyType, string | number | Date>[] = [
    {
        id: "a1b2c3d4",
        date: new Date("2024-01-10"),
        type: "inflow",
        description: "Paiement location",
        amount: '$1200',
        createdAt: new Date("2024-01-05"),
    },
    {
        id: "e5f6g7h8",
        date: new Date("2024-01-10"),
        type: "outflow",
        description: "Cleaning fee",
        amount: '$4090',
        createdAt: new Date("2024-01-10"),
    },
];


export const columns: ColumnDef<Record<KeyType, string | number | Date>>[] = [
    {
        accessorKey: "data",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{formatDateTo(row.original.date as Date, "slash")}</div>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Status variant={row.getValue("type") === 'inflow' ? "success" : "default"}>
                    <StatusLabel>{row.getValue("type") === 'inflow' ? 'Entrée' : 'Sorties'}</StatusLabel>
                </Status>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Description
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Somme
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("amount")}</div>
        ),
    },
    {
        id: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Action
                </Button>
            )
        },
        cell: ({ row }) => {
            const _ = row;
            _
            return (
                <div className="flex gap-x-2">
                    <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    <ExportTo title="Relevé" >
                        <Button variant="amber" className="size-7.5 rounded-lg"><FileDownIcon className="size-3.5" /></Button>
                    </ExportTo>
                </div>
            )
        },
    },
]