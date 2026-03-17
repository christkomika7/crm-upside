import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, EllipsisVerticalIcon, EyeIcon, HandCoinsIcon } from "lucide-react";
import { Activity, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { formatDateTo } from "@/lib/utils";
import CreatePayment from "@/components/forms/payments/create"

type KeyType = "id" | "reference" | "month" | "property" | "lot" | "amount" | "status" | "createdAt"

export const data: Record<KeyType, string | number | Date>[] = [
    {
        id: "m5gr84i9",
        reference: "REF001",
        month: 'January',
        property: "Green Valley",
        lot: "WFKXC",
        amount: "$316000",
        status: 'paid',
        createdAt: new Date("2023-01-15")
    },
    {
        id: "m5gr847s",
        reference: "REF002",
        month: 'October',
        property: "God Valley",
        lot: "BDUI82",
        amount: "$319200",
        status: 'unpaid',
        createdAt: new Date("2023-01-19")
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
                    Réfeérence
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("reference")}</div>
        ),
    },
    {
        accessorKey: "createdAt",
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
            <div className="capitalize">{formatDateTo(row.getValue("createdAt"))}</div>
        ),
    },
    {
        accessorKey: "month",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Mois
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("month")}</div>
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
        accessorKey: "lot",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Lot
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("lot")}</div>
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
                    Prix
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("amount")}</div>
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
            const [open, setOpen] = useState(false);
            const router = useRouter();
            return (
                <div className="flex gap-x-2">
                    <Link to='/dashboard/tenants/$id' params={{ id: `view_tenant-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Popover onOpenChange={setOpen} open={open}>
                        <PopoverTrigger asChild>
                            <Button variant="success" className="size-7.5 rounded-lg"><HandCoinsIcon className="size-3.5" /></Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-auto p-0">
                            <PopoverArrow />
                            <CreatePayment setOpen={setOpen} />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="size-7.5 rounded-lg"><EllipsisVerticalIcon className="size-3.5" /></Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-52 p-0">
                            <PopoverArrow />
                            <ul className=" text-sm text-neutral-600">
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate({ to: "/dashboard/tenants/edit-tenant/$id", params: { id: `edit_tenant-${row.original.id}` } })}
                                >
                                    Modifier
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Dupliquer</li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Nouveau paiement</li>
                            </ul>
                        </PopoverContent>
                    </Popover>

                </div>
            )
        },
    },
]