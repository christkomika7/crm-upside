import { ArrowLeftIcon, DownloadIcon, FileTextIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService, } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Activity, useState } from "react";
import { formatDateTo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Contract } from "@/types/contract";
import ContractDoc from "@/components/document/contract";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";

type PreviewProps = {
    id: string;
}

export default function Preview({ id }: PreviewProps) {
    const [open, setOpen] = useState(false);

    const { isPending, data: contract } = useQuery({
        queryKey: ["contract", id],
        enabled: !!id,
        queryFn: () => apiFetch<Contract>(`/contract/${id}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const mutationExport = useMutation({
        mutationFn: async ({
            contractId,
            type,
        }: {
            contractId: string;
            type: "PDF" | "DOCX";
        }) => {
            return await apiFetch<Blob>(
                `/contract/export/${contractId}?type=${type}`,
                {
                    responseType: "blob",
                }
            );
        },

        onSuccess: (blob, variables) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `contrat.${variables.type.toLowerCase()}`;
            a.click();

            window.URL.revokeObjectURL(url);

            toast.success(`Le ${type} exporté avec succès.`);
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
            queryClient.invalidateQueries({ queryKey: ["contract"] });

        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });


    function handleExport(type: "PDF" | "DOCX") {
        if (!id) return;
        mutationExport.mutate({
            contractId: id,
            type,
        });
        setOpen(false)
    }



    if (isPending || !contract) return <Spinner />

    const isMandate = contract.type === "MANDATE";
    const isCanceled = contract.isCanceled;
    const reference = contract.type === "CONTRACT" ? contract.rental?.unit.reference : contract.building?.name;
    const type = contract.type === "CONTRACT" ? "Contrat" : "Mandat";

    const status = isCanceled
        ? "CANCELED"
        : new Date(contract.end) < new Date()
            ? "EXPIRED"
            : "ACTIVE";

    const statusVariant = status === "ACTIVE" ? "success" : status === "EXPIRED" ? "warning" : "error";
    const statusLabel = status === "ACTIVE" ? "Actif" : status === "EXPIRED" ? "Expiré" : "Résilié";

    return (
        <div className="flex font-sans">
            <div className="flex-1">
                <div className="w-full h-full max-w-2xl rounded-lg flex flex-col items-center justify-center">
                    <ContractDoc id={id} />
                </div>
            </div>

            <div className="w-80 h-fit flex flex-col">
                <div className="px-6 pt-6 pb-5 rounded-t-lg bg-white">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-400 mb-1">
                                {isMandate ? "Mandat" : "Contrat"}
                            </p>
                            <p className="text-xl font-semibold text-neutral-800">
                                {reference}
                            </p>
                        </div>
                        <Status variant={statusVariant}>
                            <Activity mode={status === "ACTIVE" ? "visible" : "hidden"}>
                                <StatusIndicator />
                            </Activity>
                            <StatusLabel>{statusLabel}</StatusLabel>
                        </Status>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Type</span>
                            <span className="text-sm font-semibold text-neutral-800">
                                {isMandate ? "Mandat de gestion" : "Contrat de location"}
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Début</span>
                            <span className="text-sm font-medium text-neutral-700">
                                {formatDateTo(new Date(contract.start))}
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Fin</span>
                            <span className="text-sm font-medium text-neutral-700">
                                {formatDateTo(new Date(contract.end))}
                            </span>
                        </div>

                        {!isCanceled && (() => {
                            const now = Date.now();
                            const start = new Date(contract.start).getTime();
                            const end = new Date(contract.end).getTime();
                            const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                            return (
                                <div className="pt-1">
                                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progress.toFixed(0)}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] text-neutral-400 mt-1.5 text-right">
                                        {progress.toFixed(0)}% écoulé
                                    </p>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                <div className="flex-1 px-6 py-5 bg-white flex flex-col gap-2">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-300 mb-1">Actions</p>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="action" className="justify-start">
                                {mutationExport.isPending ? <>
                                    <Spinner />
                                    Exportation en cours...
                                </> : <>
                                    <DownloadIcon className="size-4 shrink-0" />
                                    Exporter le {type.toLowerCase()}
                                </>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-68 p-0">
                            <PopoverArrow />
                            <ul className=" text-sm text-neutral-600">
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => handleExport("PDF")}
                                >
                                    PDF
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => handleExport("DOCX")}
                                >DOCX</li>
                            </ul>
                        </PopoverContent>
                    </Popover>

                    {!isCanceled && (
                        <Button onClick={() => mutationCancel.mutate({ contractId: id })} variant="default" className="h-11! px-6! justify-start">
                            {mutationCancel.isPending ? <>
                                <Spinner />
                                Annulation du {type.toLowerCase()}.
                            </> : <>
                                <FileTextIcon className="size-4 shrink-0" />
                                Résilier le {type.toLowerCase()}
                            </>}
                        </Button>
                    )}
                </div>

                <div className="px-6 pb-6 bg-white rounded-b-lg">
                    <Link
                        to="/dashboard/contracts"
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <ArrowLeftIcon className="size-4" />
                        Quitter l'aperçu
                    </Link>
                </div>
            </div>
        </div>
    )
}