import { Button } from "@/components/ui/button";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { formatDateTo } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EllipsisVerticalIcon, EyeIcon } from "lucide-react";
import { Activity } from "react";

type KeyType = "id" | "date" | "recipient" | "type" | "status" | "createdAt"

export const data: Record<KeyType, string | number | Date>[] = [
    {
        id: "m5gr84i9",
        date: new Date("2023-01-15"),
        type: "letter",
        recipient: "John Doe",
        status: "paid",
        createdAt: new Date("2023-01-15")
    },
    {
        id: "3u1reuv4",
        date: new Date("2023-01-20"),
        type: "note",
        recipient: "Alice Johnson",
        status: "unpaid",
        createdAt: new Date("2023-01-20")
    },
]

export const columns: ColumnDef<Record<KeyType, string | number | Date>>[] = [
    {
        accessorKey: "date",
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
            <div className="capitalize">{formatDateTo(row.getValue("date"))}</div>
        ),
    },
    {
        accessorKey: "recipient",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Destinataire
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("recipient")}</div>
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
                    Statut
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
                    <StatusLabel>{row.getValue("status") === 'paid' ? 'Payé' : 'Non payé'}</StatusLabel>
                </Status>
            </div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <div className="flex gap-x-2">
                    <Link to="/dashboard/communications/edit-communication/$id"
                        params={{ id: `edit_communication-${row.original.id}` }}
                        search={{ type: row.original.type }}
                    >
                        <Button variant="outline" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to="/dashboard/communications/$id"
                        params={{ id: `view_communication-${row.original.id}` }}
                        search={{ type: row.original.type }}
                    >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button variant="amber" className="size-7.5 rounded-lg"><EllipsisVerticalIcon className="size-3.5" /></Button>
                </div>
            )
        },
    },
]