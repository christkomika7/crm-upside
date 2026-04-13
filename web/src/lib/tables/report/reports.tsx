import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Status, StatusLabel } from "@/components/ui/status";
import { apiFetch, crudService } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { withMinDelay } from "@/lib/utils";
import type { ReportTab } from "@/types/report";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export const columns: ColumnDef<ReportTab>[] = [
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
        accessorKey: "building",
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
            <div className="capitalize">{row.getValue("building")}</div>
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
                    Unité
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("unit")}</div>
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
                <Status variant={row.getValue("status") === 'CHECKED_IN' ? "success" : row.getValue("status") === 'CHECKED_OUT' ? "warning" : "info"}>
                    <StatusLabel>
                        {row.getValue("status") === 'CHECKED_IN'
                            ? 'Validé'
                            : row.getValue("status") === 'CHECKED_OUT'
                                ? 'Non validé'
                                : 'Non fait'}
                    </StatusLabel>
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
            const [exportType, setExportType] = useState<"PDF" | "DOCX" | null>(null);
            const [isValidated, setIsValidated] = useState(row.original.isChecked);


            const remove = useMutation({
                mutationFn: ({ invoiceId }: { invoiceId: string }) =>
                    crudService.delete(`/check-in-out/${invoiceId}`),
                onSuccess() {
                    queryClient.invalidateQueries({ queryKey: ["reports"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            const duplicate = useMutation({
                mutationFn: ({ reportId }: { reportId: string }) =>
                    crudService.post(`/check-in-out/duplicate/${reportId}`, {}),
                onSuccess() {
                    queryClient.invalidateQueries({ queryKey: ["reports"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });


            const exportReport = useMutation({
                mutationFn: async ({
                    reportId,
                    type,
                }: {
                    reportId: string;
                    type: "PDF" | "DOCX";
                }) => {
                    return await withMinDelay(
                        apiFetch<Blob>(
                            `/check-in-out/export/${reportId}?type=${type}`,
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
                    a.download = `etat_des_lieux.${variables.type.toLowerCase()}`;
                    a.click();

                    window.URL.revokeObjectURL(url);

                    toast.success(`L'état des lieux a été exporté avec succès.`);
                },

                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            const mutationValidate = useMutation({
                mutationFn: ({ reportId }: { reportId: string }) =>
                    crudService.put<null, void>(`/check-in-out/validate/${reportId}`, null),
                onSuccess() {
                    toast.success(`L'état des lieux a été validé avec succès.`);
                    queryClient.invalidateQueries({ queryKey: ["reports"] });
                    setIsValidated(true);
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });


            function handleExport(type: "PDF" | "DOCX") {
                setExportType(type);
                exportReport.mutate({
                    reportId: row.original.id,
                    type,
                });
            }
            return (
                <div className="flex gap-x-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="amber" className="size-7.5 rounded-lg"><EllipsisVerticalIcon className="size-3.5" /></Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-52 p-0">
                            <PopoverArrow />
                            <ul className=" text-sm text-neutral-600">
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate(
                                        {
                                            to: "/dashboard/reports/edit-report/$id",
                                            params: { id: `edit_report-${row.original.id}` },
                                            search: { tab: 'preview' }
                                        }
                                    )}
                                >
                                    Aperçu
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate(
                                        {
                                            to: "/dashboard/reports/edit-report/$id",
                                            params: { id: `edit_report-${row.original.id}` },
                                            search: { tab: 'share' }
                                        }
                                    )}
                                >
                                    Partager
                                </li>
                                <li
                                    onClick={() => handleExport("PDF")}
                                    className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                >
                                    Exporter en pdf
                                    {exportReport.isPending && exportType === "PDF" && <Spinner />}
                                </li>

                                <li
                                    onClick={() => handleExport("DOCX")}
                                    className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                >
                                    Exporter en docx
                                    {exportReport.isPending && exportType === "DOCX" && <Spinner />}
                                </li>
                                {!isValidated &&
                                    <li
                                        onClick={() => mutationValidate.mutate({ reportId: row.original.id })}
                                        className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    >
                                        Valider l'état des lieux
                                        {mutationValidate.isPending && <Spinner />}
                                    </li>
                                }
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => duplicate.mutate({ reportId: row.original.id })}
                                >Dupliquer {duplicate.isPending && <Spinner />}
                                </li>
                            </ul>
                        </PopoverContent>
                    </Popover>
                    <Link to="/dashboard/reports/edit-report/$id"
                        params={{ id: `edit_report-${row.original.id}` as string }}
                        search={{ tab: "edit" }}
                    >
                        <Button variant="outline" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => remove.mutate({ invoiceId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {remove.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]