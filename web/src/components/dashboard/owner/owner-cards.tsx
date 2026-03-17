import Card from "@/components/card/card";
import Key from "@/assets/icons/keys.png";
import Pocket from "@/assets/icons/pocket.png";
import Task from "@/assets/icons/task.png";
import Money from "@/assets/icons/money.png";
import ArrowDollars from "@/assets/icons/arrow-dollars.png";


export default function OwnerCards() {
    return (
        <div className="grid grid-cols-5 gap-4">
            <Card icon={Task} title="Unités totales" value="12" color="bg-(--card-purple)" />
            <Card icon={Key} title="Loué/Non loué" value="10/2" color="bg-(--card-blue)" />
            <Card icon={Pocket} title="Loyer mensuel" value="$8,700" color="bg-(--card-lime)" />
            <Card icon={ArrowDollars} title="Dépôt payé" value="$24,000" color="bg-(--card-sky)" />
            <Card icon={Money} title="Dû au propriétaire" value="$12,200" color="bg-(--card-pink)" />
        </div>
    )
}
