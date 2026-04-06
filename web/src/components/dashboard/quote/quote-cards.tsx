import Card from "@/components/card/card";
import Invoice from "@/assets/icons/invoice/invoice.png";
import Paid from "@/assets/icons/invoice/paid.png";
import Unpaid from "@/assets/icons/invoice/unpaid.png";

import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { formatNumber, pluralize } from "@/lib/utils";
import type { QuoteStats } from "@/types/quote";



export default function QuoteCards() {
    const { data: stats, isPending } = useQuery({
        queryKey: ["quote-stats"],
        queryFn: () => apiFetch<QuoteStats>(`/quote/stats`),
    });
    return (

        <div className="grid grid-cols-3 gap-4">
            <Card
                icon={Invoice}
                title={`${pluralize(stats?.count.total || 0, "Devis totale", "Devis totals")} (${stats?.count.total || 0})`}
                value={`${formatNumber(stats?.total || 0)} FCFA`}
                color="bg-(--card-blue)"
                isLoading={isPending}
            />

            <Card
                icon={Paid}
                title={`${pluralize(stats?.count.complete || 0, "Devis cloturé", "Devis cloturés")} (${stats?.count.complete || 0})`}
                value={`${formatNumber(stats?.complete || 0)} FCFA`}
                color="bg-(--card-green)"
                isLoading={isPending}
            />

            <Card
                icon={Unpaid}
                title={`${pluralize(stats?.count.wait || 0, "Devis en cour", "Devis en cour")} (${stats?.count.wait || 0})`}
                value={`${formatNumber(stats?.wait || 0)} FCFA`}
                color="bg-(--card-orange)"
                isLoading={isPending}
            />
        </div>
    )
}
