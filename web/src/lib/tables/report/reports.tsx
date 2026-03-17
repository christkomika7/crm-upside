import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Status, StatusLabel } from "@/components/ui/status";
import { Link, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EllipsisVerticalIcon, EyeIcon } from "lucide-react";

type KeyType = "id" | "reference" | "date" | "tenant" | "property" | "unit" | "status" | "createdAt";

export const data: Record<KeyType, string | number | Date>[] = [
    {
        id: "m5gr84i9",
        reference: "REF001",
        date: "2023-01-15",
        tenant: "Jean Dupont",
        property: "Appartement Paris 15",
        unit: "A15-2",
        status: "valid",
        createdAt: new Date("2023-01-15"),
    },
    {
        id: "3u1reuv4",
        reference: "REF002",
        date: "2023-02-10",
        tenant: "Marie Martin",
        property: "Studio Lyon 3",
        unit: "S3-7",
        status: "not-valid",
        createdAt: new Date("2023-02-10"),
    },
    {
        id: "3u1reuv5",
        reference: "REF003",
        date: "2023-03-15",
        tenant: "Pierre Durand",
        property: "Appartement Marseille 1",
        unit: "M1-4",
        status: "not-done",
        createdAt: new Date("2023-03-15"),
    },
]

export const columns: ColumnDef<Record<KeyType, string | number | Date>>[] = [
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
            <div className="capitalize">{row.getValue("date")}</div>
        ),
    },
    {
        accessorKey: "tenant",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Locataire
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tenant")}</div>
        ),
    },
    {
        accessorKey: "property",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Propriété
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("property")}</div>
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
                <Status variant={row.getValue("status") === 'valid' ? "success" : row.getValue("status") === 'not-valid' ? "warning" : "info"}>
                    <StatusLabel>
                        {row.getValue("status") === 'valid'
                            ? 'Validé'
                            : row.getValue("status") === 'not-valid'
                                ? 'Non validé'
                                : 'Non fait'}
                    </StatusLabel>
                </Status>
            </div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const router = useRouter();
            return (
                <div className="flex gap-x-2">
                    <Link to="/dashboard/reports/edit-report/$id"
                        params={{ id: `edit_report-${row.original.id}` as string }}
                    >
                        <Button variant="outline" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to="/dashboard/reports/$id"
                        params={{ id: `view_report-${row.original.id}` as string }}
                    >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="amber" className="size-7.5 rounded-lg"><EllipsisVerticalIcon className="size-3.5" /></Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-52 p-0">
                            <PopoverArrow />
                            <ul className=" text-sm text-neutral-600">
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate({ to: "/dashboard/tenants/edit-tenant/$id", params: { id: `edit_tenant-${row.original.id}` } })}
                                >
                                    Valider
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Dupliquer</li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Générer un check-out</li>
                                <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Supprimer</li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                </div>
            )
        },
    },
]