import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, StarIcon, Trash2Icon } from "lucide-react";

type KeyType = 'id' | 'name' | 'profession' | 'rating' | 'phone' | 'email' | 'amountDue' | "amountPaid" | 'createdAt';

export const data: Record<
    KeyType,
    string | string[] | number | Date
>[] = [
        {
            id: "k39dkd02a",
            name: "Ocean Breeze",
            profession: "Alice Johnson",
            rating: "4.2",
            phone: "555-5678",
            email: "alice.johnson@example.com",
            amountDue: "$950",
            amountPaid: "$900",
            createdAt: new Date("2023-02-10"),
        },
        {
            id: "x92jdla77",
            name: "Mountain View",
            profession: "Robert Brown",
            rating: "4.8",
            phone: "555-8765",
            email: "robert.brown@example.com",
            amountDue: "$2,300",
            amountPaid: "$2,000",
            createdAt: new Date("2023-03-05"),
        },
        {
            id: "p01lske44",
            name: "Green Valley",
            profession: "Maria Garcia",
            rating: "4.1",
            phone: "555-3344",
            email: "maria.garcia@example.com",
            amountDue: "$780",
            amountPaid: "$500",
            createdAt: new Date("2023-04-18"),
        },
        {
            id: "z88qwe120",
            name: "Golden Horizon",
            profession: "David Wilson",
            rating: "4.7",
            phone: "555-9988",
            email: "david.wilson@example.com",
            amountDue: "$1,500",
            amountPaid: "$1,200",
            createdAt: new Date("2023-05-22"),
        },
        {
            id: "m55ncc309",
            name: "Silver Lake",
            profession: "Sophia Martinez",
            rating: "4.3",
            phone: "555-2211",
            email: "sophia.martinez@example.com",
            amountDue: "$1,100",
            amountPaid: "$1,100",
            createdAt: new Date("2023-06-12"),
        },


    ];


export const columns: ColumnDef<Record<KeyType, string | number | Date | string[]>>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom du prestataire
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "profession",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Profession
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("profession")}</div>
        ),
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Note
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize flex gap-x-1.5 items-center"> <StarIcon className="text-amber-500 fill-amber-500 size-4" /> {row.getValue("rating")}</div>
        ),
    },
    {
        accessorKey: "phone",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Téléphone
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("phone")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "amountDue",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Montant dû
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("amountDue")}</div>
        ),
    },
    {
        accessorKey: "amountPaid",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Montant payé
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("amountPaid")}</div>
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
                    <Link to='/dashboard/service-providers/edit-service/$id' params={{ id: `edit_service-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to='/dashboard/service-providers/$id' params={{ id: `view_service-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button variant="destructive" className="size-7.5 rounded-lg bg-red-400"><Trash2Icon className="size-3.5" /></Button>
                </div>
            )
        },
    },
]