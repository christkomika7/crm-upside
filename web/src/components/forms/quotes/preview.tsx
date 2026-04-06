import { ArrowLeftIcon, DownloadIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import type { Document } from "@/types/document";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Activity, useState } from "react";
import { formatDateTo, formatNumber } from "@/lib/utils";
import Decimal from "decimal.js";
import RecordDocument from "@/components/document/record";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadComponentAsPDF } from "@/lib/document";

type PreviewProps = {
    id: string;
}

export default function Preview({
    id,
}: PreviewProps) {
    const [loading, setLoading] = useState(false);
    const { isPending, data: quote } = useQuery({
        queryKey: ["quote-document", id],
        enabled: !!id,
        queryFn: () => apiFetch<Document>(`/document/${id}?type=QUOTE`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    if (isPending || !quote) return <Spinner />

    const reference = quote.reference;
    const total = new Decimal(quote.amount || 0);

    async function downloadQuote() {
        if (!quote) return toast.error("Impossible de télécharger le devis.");

        setLoading(true);

        const filename = `Devis ${quote.reference}.pdf`;
        const start = Date.now();

        await downloadComponentAsPDF(id, filename, {
            padding: 0,
            margin: 0,
            quality: 0.98,
            scale: 3,
            headerText: `- ${filename.split(".pdf")[0]} - ${formatDateTo(new Date(quote.createdAt || new Date()))}`
        });

        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 800 - elapsed);

        setTimeout(() => {
            setLoading(false);
        }, remaining);
    }

    return (
        <div className="flex font-sans">
            <div className="flex-1">
                <div className="w-full h-full max-w-2xl bg-white rounded-lg flex flex-col items-center justify-center gap-3">
                    <RecordDocument id={id} title="Devis" type="QUOTE" data={quote} />
                </div>
            </div>

            <div className="w-80 h-fit flex flex-col">
                <div className="px-6 pt-6 pb-5 rounded-t-lg bg-white">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-400 mb-1">Devis</p>
                            <p className="text-xl font-semibold text-neutral-800">{reference}</p>
                        </div>
                        <Status variant={quote?.isComplete ? "success" : "info"}>
                            <Activity mode={quote?.isComplete ? 'visible' : 'hidden'}>
                                <StatusIndicator />
                            </Activity>
                            <StatusLabel>{quote?.isComplete ? 'Cloturè' : 'En attente'}</StatusLabel>
                        </Status>

                    </div>

                    {/* Montants */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Total</span>
                            <span className="text-sm font-semibold text-neutral-800">{formatNumber(total.toNumber())} FCFA</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-6 py-5 bg-white flex flex-col gap-2">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-300 mb-1">Actions</p>

                    <Button variant="action" onClick={downloadQuote} className="justify-start">
                        {loading ? <>
                            <Spinner />
                            Exportation en cours...
                        </> : <>
                            <DownloadIcon className="size-4 shrink-0" />
                            Exporter en PDF
                        </>}
                    </Button>
                </div>

                <div className="px-6 pb-6 bg-white rounded-b-lg">
                    <Link
                        to=".."
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