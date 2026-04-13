import { ArrowLeftIcon, DownloadIcon, FileTextIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { useState } from "react";
import { formatDateTo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import type { Report } from "@/types/report";
import ReportDoc from "@/components/document/report";

type PreviewProps = {
    id: string;
}

export default function Preview({ id }: PreviewProps) {
    const [open, setOpen] = useState(false);

    const { isPending, data: report } = useQuery({
        queryKey: ["report-preview", id],
        enabled: !!id,
        queryFn: () => apiFetch<Report>(`/check-in-out/${id}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const mutationExport = useMutation({
        mutationFn: async ({
            reportId,
            type,
        }: {
            reportId: string;
            type: "PDF" | "DOCX";
        }) => {
            return await apiFetch<Blob>(
                `/check-in-out/export/${reportId}?type=${type}`,
                { responseType: "blob" }
            );
        },
        onSuccess: (blob, variables) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `etat-des-lieux.${variables.type.toLowerCase()}`;
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
            queryClient.invalidateQueries({ queryKey: ["report-preview", id] });
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function handleExport(type: "PDF" | "DOCX") {
        if (!id) return;
        mutationExport.mutate({ reportId: id, type });
        setOpen(false);
    }

    if (isPending || !report) return <Spinner />;

    const isValidate = report.isChecked;
    const date = formatDateTo(new Date(report.date));
    const unit = report.unit.reference;
    const building = report.unit.building.name;
    const surface = report.unit.surface;
    const tenant = `${report.tenant.firstname} ${report.tenant.lastname}`;
    const type = "État des lieux";

    const statusVariant = isValidate ? "success" : "warning";
    const statusLabel = isValidate ? "Validé" : "En attente";

    return (
        <div className="flex font-sans">
            <div className="flex-1">
                <div className="w-full h-full max-w-2xl rounded-lg flex flex-col items-center justify-center">
                    <ReportDoc id={id} />
                </div>
            </div>

            <div className="w-80 h-fit flex flex-col">
                <div className="px-6 pt-6 pb-5 rounded-t-lg bg-white">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-400 mb-1">
                                État des lieux
                            </p>
                            <p className="text-xl font-semibold text-neutral-800">
                                {unit}
                            </p>
                        </div>
                        <Status variant={statusVariant}>
                            <StatusIndicator />
                            <StatusLabel>{statusLabel}</StatusLabel>
                        </Status>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Résidence</span>
                            <span className="text-sm font-semibold text-neutral-800">
                                {building}
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Locataire</span>
                            <span className="text-sm font-medium text-neutral-700">
                                {tenant}
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Surface</span>
                            <span className="text-sm font-medium text-neutral-700">
                                {surface} m²
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Date</span>
                            <span className="text-sm font-medium text-neutral-700">
                                {date}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-6 py-5 bg-white flex flex-col gap-2">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-300 mb-1">Actions</p>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="action" className="justify-start">
                                {mutationExport.isPending ? (
                                    <>
                                        <Spinner />
                                        Exportation en cours...
                                    </>
                                ) : (
                                    <>
                                        <DownloadIcon className="size-4 shrink-0" />
                                        Exporter le {type.toLowerCase()}
                                    </>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-68 p-0">
                            <PopoverArrow />
                            <ul className="text-sm text-neutral-600">
                                <li
                                    className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => handleExport("PDF")}
                                >
                                    PDF
                                </li>
                                <li
                                    className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => handleExport("DOCX")}
                                >
                                    DOCX
                                </li>
                            </ul>
                        </PopoverContent>
                    </Popover>

                    {!isValidate && (
                        <Button
                            onClick={() => mutationValidate.mutate({ reportId: id })}
                            variant="default"
                            className="h-11! px-6! justify-start"
                        >
                            {mutationValidate.isPending ? (
                                <>
                                    <Spinner />
                                    Validation en cours...
                                </>
                            ) : (
                                <>
                                    <FileTextIcon className="size-4 shrink-0" />
                                    Valider l'état des lieux
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <div className="px-6 pb-6 bg-white rounded-b-lg">
                    <Link
                        to="/dashboard/reports"
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <ArrowLeftIcon className="size-4" />
                        Quitter l'aperçu
                    </Link>
                </div>
            </div>
        </div>
    );
}