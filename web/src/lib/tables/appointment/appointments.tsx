import { Button } from "@/components/ui/button";
import { formatDateTo } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EllipsisVerticalIcon, EyeIcon } from "lucide-react";

type KeyType = "id" | "date" | "type" | "client" | "member" | "subject" | "location" | "createdAt"

export const data: Record<KeyType, string | number | Date>[] = [
    {
        id: "m5gr84i9",
        type: "upcoming",
        date: new Date("2023-01-15"),
        client: "John Doe",
        member: "Jane Smith",
        subject: "Meeting about project X",
        location: "Sunset Heights-A-101",
        createdAt: new Date("2023-01-15")
    },
    {
        id: "3u1reuv4",
        type: "past",
        date: new Date("2023-01-20"),
        client: "Alice Johnson",
        member: "Bob Williams",
        subject: "Project review meeting",
        location: "Sunset Heights-B-202",
        createdAt: new Date("2023-01-15")
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
        accessorKey: "client",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Client
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("client")}</div>
        ),
    },
    {
        accessorKey: "member",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Membre
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("member")}</div>
        ),
    },
    {
        accessorKey: "subject",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sujet
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("subject")}</div>
        ),
    },
    {
        accessorKey: "location",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Emplacement
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("location")}</div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <div className="flex gap-x-2">
                    <Link to="/dashboard/appointments/edit-appointment/$id"
                        params={{ id: `edit_appointment-${row.original.id}` }}
                        search={{ type: row.original.type }}
                    >
                        <Button variant="outline" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to="/dashboard/appointments/$id"
                        params={{ id: `view_appointment-${row.original.id}` }}
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