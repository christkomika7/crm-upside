import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, EllipsisVerticalIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { Activity } from "react";
import { useRouter } from "@tanstack/react-router";
import type { Tenant } from "@/types/tenant";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Spinner } from "@/components/ui/spinner";

export const columns: ColumnDef<Tenant>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "company",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Entreprise
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("company")}</div>
        ),
    },
    {
        accessorKey: "rentedUnit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Bien loué
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("rentedUnit")}</div>
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
                    Loyer mensuel
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
        accessorKey: "depositPaid",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Caution payé
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("depositPaid")}</div>
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
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const router = useRouter();
            const removeTenant = useMutation({
                mutationFn: ({ tenantId }: { tenantId: string }) =>
                    crudService.delete(`/tenant/${tenantId}`),
                onSuccess() {
                    toast.success("Locataire supprimée avec succès");
                    queryClient.invalidateQueries({ queryKey: ["tenants"] });
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
                                    onClick={() => router.navigate({ to: "/dashboard/tenants/edit-tenant/$id", params: { id: `edit_tenant-${row.original.id}` } })}
                                >
                                    Modifier
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Dupliquer</li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Nouveau paiement</li>
                                <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">Télécharger en pdf</li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                    <Link to='/dashboard/tenants/$id' params={{ id: `view_tenant-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => removeTenant.mutate({ tenantId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {removeTenant.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]