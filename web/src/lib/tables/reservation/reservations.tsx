import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";

type KeyType = 'id' | 'prospect' | 'unit' | 'startDate' | 'rent' | 'charges' | 'createdAt';

export const data: Record<KeyType, string | string[] | number | Date>[] = [
    {
        id: "bdjn9dnjd",
        prospect: "John Doe",
        unit: "B-301",
        startDate: new Date("2025-12-12"),
        rent: "$7,000",
        charges: "$7,000",
        createdAt: new Date("2023-01-15")
    },
    {
        id: "bdjn9dnjd",
        prospect: "John Mark",
        unit: "B-303",
        startDate: new Date("2025-10-12"),
        rent: "$12,000",
        charges: "$70,000",
        createdAt: new Date("2023-02-15")
    },
]

export const columns: ColumnDef<Record<KeyType, string | number | Date | string[]>>[] = [
    {
        accessorKey: "prospect",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom du prospect
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("prospect")}</div>
        ),
    },
    {
        accessorKey: "unit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Unité
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("unit")}</div>
        ),
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date de début
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.startDate as Date).toLocaleDateString("fr-FR", {
                day: '2-digit',
                month: "short",
                year: "2-digit"
            });
            return (
                <div className="capitalize">{date}</div>
            )
        },
    },
    {
        accessorKey: "rent",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Loyer
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize text-blue-600">{row.getValue("rent")}</div>
        ),
    },
    {
        accessorKey: "charges",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Charges
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize text-amber-400">{row.getValue("charges")}</div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            // const router = useRouter();
            return (
                <div className="flex gap-x-2">
                    <Link to='/dashboard/reservations/edit-reservation/$id' params={{ id: `edit_reservation-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to='/dashboard/reservations/$id' params={{ id: `view_reservation-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button variant="destructive" className="size-7.5 rounded-lg bg-red-400"><Trash2Icon className="size-3.5" /></Button>
                </div>
            )
        },
    },
]