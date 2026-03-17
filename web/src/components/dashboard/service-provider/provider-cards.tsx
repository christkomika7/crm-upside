import Card from "@/components/card/card";
import Users from "@/assets/icons/service-provider/users.png";
import Note from "@/assets/icons/service-provider/note.png";
import Timer from "@/assets/icons/service-provider/timer.png";
import Stars from "@/assets/icons/service-provider/stars.png";



export default function ProviderCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card icon={Users} title="Fournisseurs totaux" value="45" color="bg-(--card-purple)" />
            <Card icon={Note} title="Contrats actifs" value="32" color="bg-(--card-blue)" />
            <Card icon={Timer} title="Travaux en attente" value="12" color="bg-(--card-lime)" />
            <Card icon={Stars} title="Note moyenne" value="4.3" color="bg-(--card-orange)" />
        </div>
    )
}
