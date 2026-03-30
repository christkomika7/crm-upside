import Card from "@/components/card/card";
import Invoice from "@/assets/icons/invoice/invoice.png";
import Paid from "@/assets/icons/invoice/paid.png";
import Unpaid from "@/assets/icons/invoice/unpaid.png";
import Due from "@/assets/icons/invoice/due.png";

import type { InvoiceStats } from "@/types/invoice";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { formatNumber, pluralize } from "@/lib/utils";



export default function InvoiceCards() {
    const { data: stats, isPending } = useQuery({
        queryKey: ["invoice-stats"],
        queryFn: () => apiFetch<InvoiceStats>(`/invoice/stats`),
    });
    return (

        <div className="grid grid-cols-4 gap-4">
            <Card
                icon={Invoice}
                title={`${pluralize(stats?.count.total || 0, "Facture totale", "Factures totales")} (${stats?.count.total || 0})`}
                value={`${formatNumber(stats?.total || 0)} FCFA`}
                color="bg-(--card-blue)"
                isLoading={isPending}
            />

            <Card
                icon={Paid}
                title={`${pluralize(stats?.count.paid || 0, "Facture payée", "Factures payées")} (${stats?.count.paid || 0})`}
                value={`${formatNumber(stats?.paid || 0)} FCFA`}
                color="bg-(--card-green)"
                isLoading={isPending}
            />

            <Card
                icon={Unpaid}
                title={`${pluralize(stats?.count.pending || 0, "Facture impayée", "Factures impayées")} (${stats?.count.pending || 0})`}
                value={`${formatNumber(stats?.unpaid || 0)} FCFA`}
                color="bg-(--card-orange)"
                isLoading={isPending}
            />

            <Card
                icon={Due}
                title={`${pluralize(stats?.count.overdue || 0, "Facture due", "Factures dues")} (${stats?.count.overdue || 0})`}
                value={`${formatNumber(stats?.due || 0)} FCFA`}
                color="bg-(--card-red)"
                isLoading={isPending}
            />
        </div>
    )
}
