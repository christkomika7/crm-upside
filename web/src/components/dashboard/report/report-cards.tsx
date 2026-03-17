import Card from "@/components/card/card";
import CalendarEntry from "@/assets/icons/report/entry.png";
import CalendarOut from "@/assets/icons/report/out.png";
import List from "@/assets/icons/report/list.png";
import EditList from "@/assets/icons/report/edit-list.png";


export default function ReportCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card icon={CalendarEntry} title="Enregistrement total" value="85" color="bg-(--card-dark-purple)" />
            <Card icon={CalendarOut} title="Total des sorties" value="10" color="bg-(--card-orange)" />
            <Card icon={List} title="Rapports complétés" value="20" color="bg-(--card-green)" />
            <Card icon={EditList} title="Signatures en attente" value="5" color="bg-(--card-blue)" />
        </div>
    )
}
