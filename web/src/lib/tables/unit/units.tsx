import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Activity } from "react";
import { formatNumber } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Spinner } from "@/components/ui/spinner";
import { Route } from "@/routes/dashboard/units";
import { canAccess } from "@/lib/permission";

import type { ColumnDef } from "@tanstack/react-table";
import type { Units } from "@/types/unit";
import type { User } from "@/types/user";

export const columns: ColumnDef<Units>[] = [
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
        accessorKey: "owner",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Propriétaire
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("owner")}</div>
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
        accessorKey: "charges",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location + charges
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{formatNumber(Number(row.getValue("charges")))} FCFA</div>
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
            const { session } = Route.useRouteContext();
            const permission = (session.data?.user as unknown as User).permission?.permissions;
            const hasReadAccess = canAccess(permission, "units", ['read']);
            const hasUpdateAccess = canAccess(permission, "units", ['update']);

            const removeUnit = useMutation({
                mutationFn: ({ unitId }: { unitId: string }) =>
                    crudService.delete(`/unit/${unitId}`),
                onSuccess() {
                    toast.success("Unité supprimée avec succès");
                    queryClient.invalidateQueries({ queryKey: ["units"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });
            return (
                <div className="flex gap-x-2">
                    <Activity mode={row.original.isDeleting ? "hidden" : "visible"} >
                        <Activity mode={hasReadAccess ? 'visible' : 'hidden'}>
                            <Link to='/dashboard/units/$id' params={{ id: `view_unit-${row.original.id}` }} >
                                <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                            </Link>
                        </Activity>
                        <Activity mode={hasUpdateAccess ? 'visible' : 'hidden'}>
                            <>
                                <Link to='/dashboard/units/edit-unit/$id' params={{ id: `edit_unit-${row.original.id}` }} >
                                    <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                                </Link>
                                <Button onClick={() => removeUnit.mutate({ unitId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                                    {removeUnit.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                                </Button>
                            </>
                        </Activity>
                    </Activity>
                </div>
            )
        },
    },
]