import Card from "@/components/card/card";
import Key from "@/assets/icons/keys.png";
import Pocket from "@/assets/icons/pocket.png";
import Task from "@/assets/icons/task.png";

export default function RentalCards() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card icon={Task} title="Taux d’occupation" value="80%" color="bg-(--card-purple)" />
            <Card icon={Key} title="Locataires actifs" value="30" color="bg-(--card-blue)" />
            <Card icon={Pocket} title="Nombres d'unités" value="35/40" color="bg-(--card-lime)" view="/" />
        </div>
    )
}
