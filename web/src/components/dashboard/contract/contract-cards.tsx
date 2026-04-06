import Card from "@/components/card/card";
import EditList from "@/assets/icons/contract/edit-document.png";
import DeleteList from "@/assets/icons/contract/delete-list.png";
import WarningAlert from "@/assets/icons/contract/warning-alert.png";
import UserInfo from "@/assets/icons/contract/user-info.png";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ContractStats } from "@/types/contract";


export default function ContractCards() {
    const { data: stats, isPending } = useQuery({
        queryKey: ["contract-stats"],
        queryFn: () => apiFetch<ContractStats>(`/contract/stats`),
        staleTime: 0,
    });

    console.log(stats)

    return (
        <div className="grid grid-cols-4 gap-4">
            <Card
                icon={EditList}
                title="Contrats actifs"
                value={`${stats?.activeContracts || 0}`}
                color="bg-(--card-green)"
                isLoading={isPending}
            />
            <Card
                icon={WarningAlert}
                title="Bientôt expiré"
                value={`${stats?.expired || 0}`}
                color="bg-(--card-blue)"
                isLoading={isPending}
            />
            <Card
                icon={DeleteList}
                title="Résilié"
                value={`${stats?.canceled || 0}`}
                color="bg-(--card-red)"
                isLoading={isPending}
            />
            <Card
                icon={UserInfo}
                title="Mandats en cours"
                value={`${stats?.activeMandates || 0}`}
                color="bg-(--card-orange)"
                isLoading={isPending}
            />
        </div>
    )
}
