import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Activity } from "react";
import type { Units } from "@/types/unit";
import { cutText } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Spinner } from "@/components/ui/spinner";

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
            <div className="capitalize">{row.getValue("charges")}</div>
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
        accessorKey: "service",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Service fourni
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div>
                <Tooltip>
                    <TooltipTrigger className="capitalize">{cutText(row.getValue("service"))}</TooltipTrigger>
                    <TooltipContent className="capitalize">
                        {row.getValue("service")}
                    </TooltipContent>
                </Tooltip>
            </div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
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
                    <Link to='/dashboard/units/edit-unit/$id' params={{ id: `edit_unit-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to='/dashboard/units/$id' params={{ id: `view_unit-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => removeUnit.mutate({ unitId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {removeUnit.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]