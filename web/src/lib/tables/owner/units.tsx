import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, EyeIcon } from "lucide-react";
import {
    Status,
    StatusIndicator,
    StatusLabel,
} from "@/components/ui/status";
import { Activity } from "react";

export const data: Record<string, string | number | Date>[] = [
    {
        id: "a1b2c3d4",
        reference: "REF001",
        building: "Immeuble Ken",
        tenant: "Société Alpha",
        rent: '$1200',
        charges: '$150',
        deposit: '$2400',
        status: "paid",
        createdDate: new Date("2024-01-05"),
    },
    {
        id: "e5f6g7h8",
        reference: "REF002",
        building: "Résidence Lumière",
        tenant: "Entreprise Beta",
        rent: '$950',
        charges: '$120',
        deposit: '$1900',
        status: "overdue",
        createdDate: new Date("2024-01-10"),
    },
    {
        id: "i9j0k1l2",
        reference: "REF003",
        building: "Immeuble Atlas",
        tenant: "Société Gamma",
        rent: '$1500',
        charges: '$200',
        deposit: '$3000',
        status: "paid",
        createdDate: new Date("2024-01-12"),
    },
    {
        id: "m3n4o5p6",
        reference: "REF004",
        building: "Tour Émeraude",
        tenant: "Cabinet Delta",
        rent: '$1800',
        charges: '$250',
        deposit: '$3600',
        status: "paid",
        createdDate: new Date("2024-01-15"),
    },
    {
        id: "q7r8s9t0",
        reference: "REF005",
        building: "Résidence Palmier",
        tenant: "Société Epsilon",
        rent: '$1100',
        charges: '$130',
        deposit: '$2200',
        status: "overdue",
        createdDate: new Date("2024-01-18"),
    },
    {
        id: "u1v2w3x4",
        reference: "REF006",
        building: "Immeuble Central",
        tenant: "Entreprise Zeta",
        rent: '$2000',
        charges: '$300',
        deposit: '$4000',
        status: "paid",
        createdDate: new Date("2024-01-20"),
    },
    {
        id: "y5z6a7b8",
        reference: "REF007",
        building: "Résidence Horizon",
        tenant: "Société Eta",
        rent: '$900',
        charges: '$100',
        deposit: '$1800',
        status: "overdue",
        createdDate: new Date("2024-01-22"),
    },
    {
        id: "c9d0e1f2",
        reference: "REF008",
        building: "Immeuble Prestige",
        tenant: "Groupe Theta",
        rent: '$2500',
        charges: '$350',
        deposit: '$5000',
        status: "paid",
        createdDate: new Date("2024-01-25"),
    },
    {
        id: "g3h4i5j6",
        reference: "REF009",
        building: "Résidence Soleil",
        tenant: "Société Iota",
        rent: '$1050',
        charges: '$140',
        deposit: '$2100',
        status: "paid",
        createdDate: new Date("2024-01-27"),
    },
    {
        id: "k7l8m9n0",
        reference: "REF010",
        building: "Tour Atlas",
        tenant: "Entreprise Kappa",
        rent: '$1700',
        charges: '$220',
        deposit: '$3400',
        status: "overdue",
        createdDate: new Date("2024-01-30"),
    },
];


export const columns: ColumnDef<Record<string, string | number | Date>>[] = [
    {
        accessorKey: "reference",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Reference
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("reference")}</div>
        ),
    },
    {
        accessorKey: "building",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Bâtiment
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("building")}</div>
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
            <div className="capitalize">{row.getValue("rent")}</div>
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
            <div className="capitalize">{row.getValue("charges")}</div>
        ),
    },
    {
        accessorKey: "deposit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Caution versée
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("deposit")}</div>
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
                    <Activity mode={row.getValue("status") === 'overdue' ? 'visible' : 'hidden'}>
                        <StatusIndicator />
                    </Activity>
                    <StatusLabel>{row.getValue("status") === 'paid' ? 'Payé' : 'En retard'}</StatusLabel>
                </Status>
            </div>
        ),
    },
    {
        id: "id",
        header: "",
        enableHiding: false,
        cell: ({ row }) => {
            const _ = row;
            _
            return (
                <div className="flex gap-x-2">
                    <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                </div>
            )
        },
    },
]