import { Button } from "@/components/ui/button";
import ManagementStatus, { type ManagementStatusKey } from "@/components/ui/management-status";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";

type KeyType = 'id' | 'building' | 'unit' | 'type' | 'services' | "commission" | 'createdAt';

export const data: Record<KeyType, string | string[] | number | Date>[] = [
    {
        id: "bdjn9dnjd",
        building: "John Doe",
        unit: "B-301",
        type: "yes",
        services: ["pool", "garden"],
        commission: "10%",
        createdAt: new Date("2023-01-15")
    },
    {
        id: "bdjn9dnjd",
        building: "John Mark",
        unit: "B-303",
        type: "no",
        services: ["gym", "pool"],
        commission: "30%",
        createdAt: new Date("2023-02-15")
    },
]

export const columns: ColumnDef<Record<KeyType, string | number | Date | string[]>>[] = [
    {
        accessorKey: "building",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom du bâtiment
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("building")}</div>
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
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type de management
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.original.type === "yes" ? "Oui" : "Non"}</div>
        ),
    },
    {
        accessorKey: "services",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Services
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const services: string[] = row.getValue("services");
            return (

                <div className="capitalize flex gap-x-2">{
                    services.map((service, index) => (
                        <ManagementStatus key={index} value={service as ManagementStatusKey} />
                    ))
                }</div>
            )
        }
    },
    {
        accessorKey: "commission",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    % de commission
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("commission")}</div>
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
                    <Link to='/dashboard/property-management/edit-property/$id' params={{ id: `edit_property-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to='/dashboard/property-management/$id' params={{ id: `view_property-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button variant="destructive" className="size-7.5 rounded-lg bg-red-400"><Trash2Icon className="size-3.5" /></Button>
                </div>
            )
        },
    },
]