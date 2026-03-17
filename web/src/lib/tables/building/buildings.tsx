import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";
import PropertiesStatus from "@/components/ui/properties-status";
import type { Building } from "@/types/building";
import type { LotType } from "@/types/lot-type";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Spinner } from "@/components/ui/spinner";


export const columns: ColumnDef<Building>[] = [
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
        accessorKey: "name",
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
            <div className="capitalize">{row.getValue("name")}</div>
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
        accessorKey: "unit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    No. d'unités
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("unit")}</div>
        ),
    },
    {
        accessorKey: "occupancy",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Occupancy rate
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("occupancy")}</div>
        ),
    },
    {
        accessorKey: "lotTypes",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type de propriétés
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const properties: LotType[] = row.getValue("lotTypes");
            return (
                <div className="flex flex-wrap gap-2 max-w-[300px]">
                    {properties.map((property, index) => (
                        <PropertiesStatus key={index} value={property.name} index={index} />

                    ))}
                </div>
            )
        }
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {

            const removeBuilding = useMutation({
                mutationFn: ({ buildingId }: { buildingId: string }) =>
                    crudService.delete(`/building/${buildingId}`),
                onSuccess() {
                    toast.success("Bâtiment supprimée avec succès");
                    queryClient.invalidateQueries({ queryKey: ["buildings"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            return (
                <div className="flex gap-x-2">
                    <Link to='/dashboard/buildings/edit-building/$id' params={{ id: `edit_building-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to='/dashboard/buildings/$id' params={{ id: `view_building-${row.original.id}` }} >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => removeBuilding.mutate({ buildingId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {removeBuilding.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]