import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, EyeIcon, FileDownIcon } from "lucide-react";
import {
    Status,
    StatusIndicator,
    StatusLabel,
} from "@/components/ui/status";
import { Activity } from "react";
import ExportTo from "@/components/modal/export-to";


type KeyType = "id" | "unit" | "owner" | "status" | "balance" | "overdue" | "createdAt"

export const data: Record<KeyType, string | number | Date>[] = [
    {
        id: "a1b2c3d4",
        unit: "A-101",
        owner: "Warren Buffet",
        status: "paid",
        balance: '$1200',
        overdue: '$150',
        createdAt: new Date("2024-01-05"),
    },
    {
        id: "e5f6g7h8",
        unit: "A-102",
        owner: "Warren Buffet",
        status: "unpaid",
        balance: '$409',
        overdue: '$120',
        createdAt: new Date("2024-01-10"),
    },
];


export const columns: ColumnDef<Record<KeyType, string | number | Date>>[] = [
    {
        accessorKey: "unit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    UNité
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("unit")}</div>
        ),
    },
    {
        accessorKey: "owner",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Propriétaire
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("owner")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Statut de la facture
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Status variant={row.getValue("status") === 'paid' ? "success" : "warning"}>
                    <Activity mode={row.getValue("status") === 'unpaid' ? 'visible' : 'hidden'}>
                        <StatusIndicator />
                    </Activity>
                    <StatusLabel>{row.getValue("status") === 'paid' ? 'Payé' : 'Impayé'}</StatusLabel>
                </Status>
            </div>
        ),
    },
    {
        accessorKey: "balance",
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
            <div className="capitalize">{row.getValue("balance")}</div>
        ),
    },
    {
        accessorKey: "overdue",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Dûe
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("overdue")}</div>
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