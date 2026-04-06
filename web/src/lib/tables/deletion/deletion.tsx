import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { crudService } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import type { Deletion, DeletionAction } from "@/types/deletion";
import { useMutation } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, CheckIcon, Undo2Icon } from "lucide-react";
import { toast } from "sonner";



export const columns: ColumnDef<Deletion>[] = [
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
        accessorKey: "actionBy",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Effectué par
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("actionBy")}</div>
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
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {

            const action = useMutation({
                mutationFn: ({ deletionId, data }: { deletionId: string, data: DeletionAction }) =>
                    crudService.put(`/deletion/${deletionId}`, data),
                async onSuccess(data) {
                    toast.success(data.message);

                    const typeQueryKeyMap: Record<string, string> = {
                        OWNER: "owners",
                        TENANT: "tenants",
                        UNIT: "units",
                        RENTAL: "rentals",
                        RESERVATION: "reservations",
                        BUILDING: "buildings",
                        PROPERTY_MANAGEMENT: "property-managements",
                        INVOICING: "invoices",
                        QUOTE: "quotes",
                        CONTRACT: "contracts",
                    };

                    const relatedQueryKey = typeQueryKeyMap[row.original.type];

                    await Promise.all([
                        ...(relatedQueryKey
                            ? [queryClient.invalidateQueries({ queryKey: [relatedQueryKey] })]
                            : []
                        ),
                        queryClient.invalidateQueries({ queryKey: ["deletions"] }),
                    ]);
                },
                onError: (error: Error) => {
                    toast.error(error.message);
                },
            });
            return (
                <div className="flex gap-x-2">
                    <Button onClick={() => action.mutate({ deletionId: row.original.id, data: "CANCEL" })} variant="ghost" className="size-7.5 rounded-lg bg-neutral-100">
                        {action.isPending ? <Spinner className="text-white size-3.5" /> : <Undo2Icon className="size-3.5" />}
                    </Button>
                    <Button onClick={() => action.mutate({ deletionId: row.original.id, data: "DELETE" })} variant="success" className="size-7.5 rounded-lg bg-emerald-100">
                        {action.isPending ? <Spinner className="text-white size-3.5" /> : <CheckIcon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]