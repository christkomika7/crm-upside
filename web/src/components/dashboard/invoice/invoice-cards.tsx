import Card from "@/components/card/card";
import Key from "@/assets/icons/keys.png";
import Pocket from "@/assets/icons/pocket.png";
import Task from "@/assets/icons/task.png";
import ArrowDollars from "@/assets/icons/arrow-dollars.png";


export default function InvoiceCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card icon={Task} title="Factures totales" value="$120000" color="bg-(--card-purple)" />
            <Card icon={Key} title="Payé" value="$67000" color="bg-(--card-blue)" />
            <Card icon={Pocket} title="Impayé" value="$8,700" color="bg-(--card-lime)" />
            <Card icon={ArrowDollars} title="Dûe" value="$24,000" color="bg-(--card-sky)" />
        </div>
    )
}
