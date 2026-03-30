"use client"

import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { type Tax } from "@/types/tax";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FileText } from "lucide-react";
import { useMemo } from "react";
import TaxRow from "./edit";

export default function ListTax() {
    const { isPending, data: rawTaxes } = useQuery<Tax[]>({
        queryKey: ["taxes"],
        queryFn: () => apiFetch<Tax[]>("/tax"),
    });

    const taxes = useMemo(() => {
        return rawTaxes ? [...rawTaxes].sort((a, b) => a.id.localeCompare(b.id)) : [];
    }, [rawTaxes]);

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner />
            </div>
        );
    }

    if (!taxes || taxes.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FileText className="size-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>Aucune taxe enregistrée</EmptyTitle>
                    <EmptyDescription>
                        Vous n'avez encore ajouté aucune taxe.
                        Créez votre première taxe pour commencer la configuration.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="space-y-1">
            <div className="grid grid-cols-[1fr_120px_1fr_88px] gap-3 px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Taux</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cumuls</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</span>
            </div>

            <div className="space-y-1">
                {taxes.map((tax) => (
                    <TaxRow
                        key={tax.id}
                        tax={tax}
                        allTaxes={taxes}
                    />
                ))}
            </div>
        </div>
    );
}