import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { crudService } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { cn, formatNumber } from "@/lib/utils";
import type { InvoiceTab } from "@/types/invoice";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { Activity } from "react";
import { toast } from "sonner";


export const columns: ColumnDef<InvoiceTab>[] = [
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
        accessorKey: "type",
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
        cell: ({ row }) => (
            <div className={cn("capitalize", {
                "text-blue-500": row.getValue("type") === "TENANT",
                "text-amber-400": row.getValue("type") === "OWNER"
            })}>{row.getValue("type") === "TENANT" ? "Locataire" : "Propriétaire"}</div>
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
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Montant
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{formatNumber(row.getValue("amount"))} FCFA</div>
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
            <div className="capitalize">{formatNumber(row.getValue("amountPaid"))} FCFA</div>
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
                <Status variant={row.getValue("status") === 'PAID' ? "success" : row.getValue("status") === 'PENDING' ? "warning" : "error"}>
                    <Activity mode={row.getValue("status") === 'OVERDUE' ? 'visible' : 'hidden'}>
                        <StatusIndicator />
                    </Activity>
                    <StatusLabel>{row.getValue("status") === 'PAID' ? 'Payé' : row.getValue("status") === 'PENDING' ? 'En attente' : 'En retard'}</StatusLabel>
                </Status>
            </div>
        ),
    },
    {
        accessorKey: "issue",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date d'emission
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("issue")}</div>
        ),
    },
    {
        accessorKey: "due",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date d'échéance
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("due")}</div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const router = useRouter();
            const removeInvoice = useMutation({
                mutationFn: ({ invoiceId }: { invoiceId: string }) =>
                    crudService.delete(`/invoice/${invoiceId}`),
                onSuccess() {
                    queryClient.invalidateQueries({ queryKey: ["invoices"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });
            return (
                <div className="flex gap-x-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="size-7.5 rounded-lg"><EllipsisVerticalIcon className="size-3.5" /></Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-52 p-0">
                            <PopoverArrow />
                            <ul className=" text-sm text-neutral-600">
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate({ to: "/dashboard/invoices/$id", params: { id: `view_invoice-${row.original.id}` }, search: { type: row.original.type } })}
                                >
                                    Aperçu
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Dupliquer</li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Effectuer un paiement</li>
                                <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Télécharger la facture</li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                    <Link to="/dashboard/invoices/edit-invoice/$id"
                        params={{ id: `edit_invoice-${row.original.id}` }}
                        search={{ type: row.original.type }}
                    >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => removeInvoice.mutate({ invoiceId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {removeInvoice.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]