import Card from "@/components/card/card";
import CheckCalendar from "@/assets/icons/appointment/check-calendar.png";
import NextCalendar from "@/assets/icons/appointment/next-calendar.png";
import Alert from "@/assets/icons/appointment/alert.png";
import CheckList from "@/assets/icons/appointment/check-list.png";


export default function AppointmentCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card icon={CheckCalendar} title="Rendez-vous d'aujourd'hui" value="8" color="bg-(--card-dark-purple)" />
            <Card icon={NextCalendar} title="À venir cette semaine" value="3 mois" color="bg-(--card-green)" />
            <Card icon={Alert} title="En retard" value="2" color="bg-(--card-red)" />
            <Card icon={CheckList} title="Complété" value="25" color="bg-(--card-green)" />
        </div>
    )
}
