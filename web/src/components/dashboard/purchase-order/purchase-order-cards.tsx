import Card from "@/components/card/card";
import Invoice from "@/assets/icons/invoice/invoice.png";
import Paid from "@/assets/icons/invoice/paid.png";
import Unpaid from "@/assets/icons/invoice/unpaid.png";
import Due from "@/assets/icons/invoice/due.png";

import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { formatNumber, pluralize } from "@/lib/utils";
import type { PurchaseOrderStats } from "@/types/purchase-order";

export default function PurchaseOrderCards() {
    const { data: stats, isPending } = useQuery({
        queryKey: ["purchase-order-stats"],
        queryFn: () => apiFetch<PurchaseOrderStats>(`/purchase-order/stats`),
    });
    return (

        <div className="grid grid-cols-4 gap-4">
            <Card
                icon={Invoice}
                title={`${pluralize(stats?.count.total || 0, "BC total", "BC totaux")} (${stats?.count.total || 0})`}
                value={`${formatNumber(stats?.total || 0)} FCFA`}
                color="bg-(--card-blue)"
                isLoading={isPending}
            />

            <Card
                icon={Paid}
                title={`${pluralize(stats?.count.paid || 0, "BC payé", "BC payés")} (${stats?.count.paid || 0})`}
                value={`${formatNumber(stats?.paid || 0)} FCFA`}
                color="bg-(--card-green)"
                isLoading={isPending}
            />

            <Card
                icon={Unpaid}
                title={`${pluralize(stats?.count.pending || 0, "BC impayé", "BC impayés")} (${stats?.count.pending || 0})`}
                value={`${formatNumber(stats?.unpaid || 0)} FCFA`}
                color="bg-(--card-orange)"
                isLoading={isPending}
            />

            <Card
                icon={Due}
                title={`${pluralize(stats?.count.overdue || 0, "BC dû", "BC dus")} (${stats?.count.overdue || 0})`}
                value={`${formatNumber(stats?.due || 0)} FCFA`}
                color="bg-(--card-red)"
                isLoading={isPending}
            />
        </div>
    )
}
