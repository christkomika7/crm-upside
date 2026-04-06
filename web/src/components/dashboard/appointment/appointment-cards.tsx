import Card from "@/components/card/card";
import CheckCalendar from "@/assets/icons/appointment/check-calendar.png";
import NextCalendar from "@/assets/icons/appointment/next-calendar.png";
import Alert from "@/assets/icons/appointment/alert.png";
import CheckList from "@/assets/icons/appointment/check-list.png";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { AppointmentStats } from "@/types/appointment";
import { capitalize } from "strfi";


export default function AppointmentCards() {
    const { data: stats, isPending } = useQuery({
        queryKey: ["appointment-stats"],
        queryFn: () => apiFetch<AppointmentStats>(`/appointment/stats`),
    });
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card icon={CheckCalendar} title="Rendez-vous d'aujourd'hui" value={stats?.today.toString() || "0"} color="bg-(--card-dark-purple)" isLoading={isPending} />
            <Card icon={NextCalendar} title="À venir cette semaine" value={capitalize(stats?.upcoming || "Aucun")} color="bg-(--card-green)" isLoading={isPending} />
            <Card icon={Alert} title="En retard" value={stats?.expired.toString() || "0"} color="bg-(--card-red)" isLoading={isPending} />
            <Card icon={CheckList} title="Complété" value={stats?.completed.toString() || "0"} color="bg-(--card-green)" isLoading={isPending} />
        </div>
    )
}
