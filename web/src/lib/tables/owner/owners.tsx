import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { crudService } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import type { Owner } from "@/types/owner";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";



export const columns: ColumnDef<Owner>[] = [
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
            <div>{row.getValue("email")}</div>
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
                    Propriétés
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("properties")}</div>
        ),
    },
    {
        accessorKey: "units",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Unités
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("units")}</div>
        ),
    },
    {
        accessorKey: "revenue",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Revenue
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("revenue")}</div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const removeOwner = useMutation({
                mutationFn: ({ ownerId }: { ownerId: string }) =>
                    crudService.delete(`/owner/${ownerId}`),
                onSuccess() {
                    toast.success("Propriétaire supprimée avec succès");
                    queryClient.invalidateQueries({ queryKey: ["owners"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });
            return (
                <div className="flex gap-x-2">
                    <Link to="/dashboard/owners/edit-owner/$id" params={{ id: `edit_owner-${row.original.id}` as string }}>
                        <Button variant="outline" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to="/dashboard/owners/$id" params={{ id: `view_owner-${row.original.id}` as string }}>
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => removeOwner.mutate({ ownerId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {removeOwner.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]