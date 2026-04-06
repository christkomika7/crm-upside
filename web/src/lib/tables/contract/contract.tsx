import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { apiFetch, crudService } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { cn, formatNumber, withMinDelay } from "@/lib/utils";
import type { ContractTab } from "@/types/contract";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { Activity, useState } from "react";
import { toast } from "sonner";


export const columns: ColumnDef<ContractTab>[] = [
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
                "text-blue-500": row.getValue("type") === "MANDATE",
                "text-amber-400": row.getValue("type") === "CONTRACT"
            })}>{row.getValue("type") === "CONTRACT" ? "Contrat de location" : "Mandat de gestion"}</div>
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
                    Début du contrat
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("issue")}</div>
        ),
    },
    {
        accessorKey: "duration",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Durée
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("duration")}</div>
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
                <Status variant={row.getValue("status") === 'ACTIVE' ? "success" : row.getValue("status") === 'CANCELLED' ? "error" : "warning"}>
                    <Activity mode={row.getValue("status") === 'ACTIVE' ? 'visible' : 'hidden'}>
                        <StatusIndicator />
                    </Activity>
                    <StatusLabel>{row.getValue("status") === "ACTIVE" ? "Actif" : row.getValue("status") === "CANCELLED" ? "Résilié" : "Expiré"}</StatusLabel>
                </Status>
            </div>
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
                    Location
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("rent") === "-" ? "-" : formatNumber(row.getValue("rent")) + " FCFA"}</div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const router = useRouter();
            const [exportType, setExportType] = useState<"PDF" | "DOCX" | null>(null);
            const [isCanceled, setIsCanceled] = useState(row.original.isCanceled);

            const type = row.original.type === "CONTRACT" ? "Contrat" : "Mandat";


            const remove = useMutation({
                mutationFn: ({ contractId }: { contractId: string }) =>
                    crudService.delete(`/contract/${contractId}`),
                onSuccess() {
                    queryClient.invalidateQueries({ queryKey: ["contracts"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });


            const exportContract = useMutation({
                mutationFn: async ({
                    contractId,
                    type,
                }: {
                    contractId: string;
                    type: "PDF" | "DOCX";
                }) => {
                    return await withMinDelay(
                        apiFetch<Blob>(
                            `/contract/export/${contractId}?type=${type}`,
                            {
                                responseType: "blob",
                            }
                        ),
                        700
                    );
                },

                onSuccess: (blob, variables) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `contrat.${variables.type.toLowerCase()}`;
                    a.click();

                    window.URL.revokeObjectURL(url);

                    toast.success(`Le ${variables.type} exporté avec succès.`);
                },

                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            const mutationCancel = useMutation({
                mutationFn: ({ contractId }: { contractId: string }) =>
                    crudService.put<null, void>(`/contract/cancel/${contractId}`, null),
                onSuccess() {
                    toast.success(`Le ${type} a été annulé avec succès.`);
                    queryClient.invalidateQueries({ queryKey: ["contracts"] });
                    setIsCanceled(true);

                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });


            function handleExport(type: "PDF" | "DOCX") {
                setExportType(type);
                exportContract.mutate({
                    contractId: row.original.id,
                    type,
                });
            }


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
                                    onClick={() => router.navigate({ to: "/dashboard/contracts/edit-contract/$id", params: { id: `edit_contract-${row.original.id}` }, search: { type: row.original.type, tab: "preview" } })}
                                >
                                    Aperçu
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate({ to: "/dashboard/contracts/edit-contract/$id", params: { id: `edit_contract-${row.original.id}` }, search: { type: row.original.type, tab: "share" } })}
                                >
                                    Partager
                                </li>
                                <li
                                    onClick={() => handleExport("PDF")}
                                    className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                >
                                    Exporter en pdf
                                    {exportContract.isPending && exportType === "PDF" && <Spinner />}
                                </li>

                                <li
                                    onClick={() => handleExport("DOCX")}
                                    className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                >
                                    Exporter en docx
                                    {exportContract.isPending && exportType === "DOCX" && <Spinner />}
                                </li>

                                {!isCanceled &&
                                    <li
                                        onClick={() => mutationCancel.mutate({ contractId: row.original.id })}
                                        className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    >
                                        Résilier le {type}
                                        {mutationCancel.isPending && <Spinner />}
                                    </li>
                                }
                            </ul>
                        </PopoverContent>
                    </Popover>
                    <Link to="/dashboard/contracts/edit-contract/$id"
                        params={{ id: `edit_contract-${row.original.id}` }}
                        search={{ type: row.original.type, tab: "edit" }}
                    >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => remove.mutate({ contractId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {remove.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]