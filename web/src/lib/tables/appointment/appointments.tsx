import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { crudService } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { cutText } from "@/lib/utils";
import type { AppointmentTab } from "@/types/appointment";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, CalendarCheck2Icon, Edit3Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

export const columns: ColumnDef<AppointmentTab>[] = [
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
            <div className="capitalize">
                <Tooltip>
                    <TooltipTrigger>
                        {cutText(row.getValue("client"), 18)}
                    </TooltipTrigger>
                    <TooltipContent>
                        {row.getValue("client")}
                    </TooltipContent>
                </Tooltip>
            </div>
        ),
    },
    {
        accessorKey: "members",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Membres
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const members = row.original.members.join(", ");
            return (
                <div className="capitalize">
                    <Tooltip>
                        <TooltipTrigger>
                            {cutText(members, 18)}
                        </TooltipTrigger>
                        <TooltipContent>
                            {members}
                        </TooltipContent>
                    </Tooltip>
                </div>
            )
        },
    },
    {
        accessorKey: "subject",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sujet
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Tooltip>
                    <TooltipTrigger>
                        {cutText(row.getValue("subject"), 18)}
                    </TooltipTrigger>
                    <TooltipContent>
                        {row.getValue("subject")}
                    </TooltipContent>
                </Tooltip>
            </div>
        ),
    },
    {
        accessorKey: "address",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Lieu
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">
                <Tooltip>
                    <TooltipTrigger>
                        {cutText(row.getValue("address"), 18)}
                    </TooltipTrigger>
                    <TooltipContent>
                        {row.getValue("address")}
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
            const remove = useMutation({
                mutationFn: ({ buildingId }: { buildingId: string }) =>
                    crudService.delete(`/appointment/${buildingId}`),
                onSuccess(data) {
                    toast.success(data.message);
                    queryClient.invalidateQueries({ queryKey: ["appointments"] });
                    queryClient.invalidateQueries({ queryKey: ["deletions"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            const complete = useMutation({
                mutationFn: ({ buildingId }: { buildingId: string }) =>
                    crudService.put(`/appointment/complete/${buildingId}`, {}),
                onSuccess(data) {
                    toast.success(data.message);
                    queryClient.invalidateQueries({ queryKey: ["appointments"] });
                    queryClient.invalidateQueries({ queryKey: ["appointment-stats"] });
                    queryClient.invalidateQueries({ queryKey: ["deletions"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            return (
                <div className="flex gap-x-2">
                    {!row.original.isComplete && (
                        <>
                            <Link to="/dashboard/appointments/edit-appointment/$id"
                                params={{ id: `edit_appointment-${row.original.id}` }}
                            >
                                <Button variant="outline" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                            </Link>
                            <Button onClick={() => complete.mutate({ buildingId: row.original.id })} variant="emerald" className="size-7.5! rounded-lg">
                                {complete.isPending ? <Spinner className="text-white size-3.5" /> : <CalendarCheck2Icon className="size-3.5" />}
                            </Button>
                        </>
                    )}
                    <Button onClick={() => remove.mutate({ buildingId: row.original.id })} variant="red" className="size-7.5! rounded-lg">
                        {remove.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]