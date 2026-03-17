import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";
import PropertiesStatus, { type PropertiesStatusKey } from "@/components/ui/properties-status";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Activity } from "react";

type KeyType = 'id' | 'reference' | 'area' | 'status' | 'properties' | 'createdAt';

export const data: Record<KeyType, string | string[] | number | Date>[] = [
    {
        id: "m5gr84i9",
        reference: "bdjn9dnjd",
        properties: ['apartment', 'office'],
        area: "650 Square feet",
        status: "vacant",
        createdAt: new Date("2023-01-15")
    },
    {
        id: "m5gr8i9",
        reference: "bdjn9dnjd",
        properties: ['shop', 'villa'],
        area: "650 Square feet",
        status: "rented",
        createdAt: new Date("2023-01-15")
    },
]

export const columns: ColumnDef<Record<KeyType, string | number | Date | string[]>>[] = [
    {
        accessorKey: "reference",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Référence
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("reference")}</div>
        ),
    },
    {
        accessorKey: "properties",
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
        cell: ({ row }) => {
            const properties: string[] = row.getValue("properties");
            return (

                <div className="capitalize flex gap-x-2">{
                    properties.map((property, index) => (
                        <PropertiesStatus key={index} value={property as PropertiesStatusKey} />
                    ))
                }</div>
            )
        }
    },
    {
        accessorKey: "area",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Surface
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("area")}</div>
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
                <Status variant={row.getValue("status") === 'vacant' ? "success" : "warning"}>
                    <Activity mode={row.getValue("status") === 'vacant' ? 'visible' : 'hidden'}>
                        <StatusIndicator />
                    </Activity>
                    <StatusLabel>{row.getValue("status") === 'vacant' ? 'Libre' : 'Occupé'}</StatusLabel>
                </Status>
            </div>
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
                    <Link to='/dashboard/buildings/edit-building/$id' params={{ id: `edit_building-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to='/dashboard/buildings/$id' params={{ id: `view_building-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button variant="destructive" className="size-7.5 rounded-lg bg-red-400"><Trash2Icon className="size-3.5" /></Button>
                </div>
            )
        },
    },
]