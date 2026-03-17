import Card from "@/components/card/card";
import Key from "@/assets/icons/keys.png";
import Pocket from "@/assets/icons/pocket.png";
import Task from "@/assets/icons/task.png";
import ArrowDollars from "@/assets/icons/arrow-dollars.png";

export default function TenantCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card icon={Task} title="Unpaid rent for" value="3 mois" color="bg-(--card-purple)" status="warning" />
            <Card icon={Key} title="Unpaid charges for" value="3 mois" color="bg-(--card-blue)" status="warning" />
            <Card icon={Pocket} title="Entry & Reg. Fee" value="Paid" color="bg-(--card-lime)" status="success" />
            <Card icon={ArrowDollars} title="Dépôt" value="$24,000" color="bg-(--card-sky)" status="success" />
        </div>
    )
}
