import { Spinner } from "@/components/ui/spinner";
import { FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { type Tax } from "@/types/tax";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import EditTax from "./edit";


export default function ListTax() {
    const { isPending, data: taxes } = useQuery<Tax[]>({
        queryKey: ["taxes"],
        queryFn: () => apiFetch<Tax[]>("/tax/all"),
    });


    if (isPending) {
        return (
            <div className="flex justify-center items-center py-8">
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
        <>
            {taxes.map((tax, index) => (
                <EditTax key={index} tax={tax} />
            ))}
        </>
    )
}
