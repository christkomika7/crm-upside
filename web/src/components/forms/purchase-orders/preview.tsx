import { ArrowLeftIcon, ClockIcon, DownloadIcon, RefreshCwIcon, WalletIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import type { Document } from "@/types/document";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Activity, useState } from "react";
import { formatDateTo, formatNumber } from "@/lib/utils";
import Decimal from "decimal.js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadComponentAsPDF } from "@/lib/document";
import RecordDocument from "@/components/document/record";

type PreviewProps = {
    id: string;
}

export default function Preview({
    id,
}: PreviewProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const { isPending, data: purchaseOrder } = useQuery({
        queryKey: ["purchase-order-document", id],
        enabled: !!id,
        queryFn: () => apiFetch<Document>(`/document/${id}?type=PURCHASE_ORDER`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    if (isPending || !purchaseOrder) return <Spinner />

    const reference = purchaseOrder.reference;
    const total = new Decimal(purchaseOrder.amount);
    const paid = new Decimal(purchaseOrder.amountPaid);
    const due = total.minus(paid);
    const paidPercent = paid.div(total).mul(100).toNumber().toFixed(0);

    async function downloadPurchaseOrder() {
        if (!purchaseOrder) return toast.error("Impossible de télécharger le bon de commande.");

        setIsDownloading(true);

        const filename = `Bon de commande ${purchaseOrder.reference}.pdf`;
        const start = Date.now();

        await downloadComponentAsPDF(id, filename, {
            padding: 0,
            margin: 0,
            quality: 0.98,
            scale: 3,
            headerText: `- ${filename.split(".pdf")[0]} - ${formatDateTo(new Date(purchaseOrder.createdAt || new Date()))}`
        });

        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 800 - elapsed);

        setTimeout(() => {
            setIsDownloading(false);
        }, remaining);
    }

    return (
        <div className="flex font-sans">
            <div className="flex-1">
                <div className="w-full h-full max-w-2xl  bg-white rounded-lg flex relative justify-center gap-3">
                    <RecordDocument id={id} title="Bon de commande" type="PURCHASE_ORDER" data={purchaseOrder} />
                </div>
            </div>

            <div className="w-80 h-fit flex flex-col">
                <div className="px-6 pt-6 pb-5 rounded-t-lg bg-white">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-400 mb-1">Bon de commande</p>
                            <p className="text-xl font-semibold text-neutral-800">{reference}</p>
                        </div>
                        <Status variant={purchaseOrder.status === 'PAID' ? "success" : purchaseOrder.status === 'PENDING' ? "info" : "error"}>
                            <Activity mode={purchaseOrder.status === 'OVERDUE' ? 'visible' : 'hidden'}>
                                <StatusIndicator />
                            </Activity>
                            <StatusLabel>{purchaseOrder.status === 'PAID' ? 'Payé' : purchaseOrder.status === 'PENDING' ? 'En attente' : 'En retard'}</StatusLabel>
                        </Status>

                    </div>

                    {/* Montants */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Total</span>
                            <span className="text-sm font-semibold text-neutral-800">{formatNumber(total.toNumber())} FCFA</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Payé</span>
                            <span className="text-sm font-medium text-emerald-600">{formatNumber(paid.toNumber())} FCFA</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs text-neutral-400">Reste à payer</span>
                            <span className="text-sm font-medium text-red-500">{formatNumber(due.toNumber())} FCFA</span>
                        </div>
                        <div className="pt-1">
                            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-background rounded-full transition-all duration-500"
                                    style={{ width: `${paidPercent}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-1.5 text-right">{paidPercent}% réglé</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-6 py-5 bg-white flex flex-col gap-2">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-300 mb-1">Actions</p>

                    <Button variant="action" onClick={downloadPurchaseOrder} className="justify-start">
                        {isDownloading ? <>
                            <Spinner />
                            Exportation en cours...
                        </> : <>
                            <DownloadIcon className="size-4 shrink-0" />
                            Exporter en PDF
                        </>}
                    </Button>

                    <Button variant="default" className="h-11! px-6! justify-start">
                        <WalletIcon className="size-4 shrink-0" />
                        Effectuer un paiement
                    </Button>

                    <div className="border-t border-neutral-100 my-1" />

                    <Button variant="outline" className="justify-start px-6! h-11!">
                        <RefreshCwIcon className="size-4 shrink-0 text-neutral-400" />
                        Créer une récurrence
                    </Button>

                    <Button variant="outline" className="justify-start px-6! h-11!">
                        <ClockIcon className="size-4 shrink-0 text-neutral-400" />
                        Historique des paiements
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