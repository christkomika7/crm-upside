import Card from "@/components/card/card";


import Inflow from "@/assets/icons/accounting/inflow.png";
import Outflow from "@/assets/icons/accounting/outflow.png";
import AgencyFees from "@/assets/icons/accounting/agency-fees.png";
import ManagementFees from "@/assets/icons/accounting/management-fees.png";
import Deposit from "@/assets/icons/accounting/deposit.png";


export default function AccountingCards() {
    return (
        <div className="grid grid-cols-5 gap-4">
            <Card icon={Inflow} title="Entrée total" value="$120000" color="bg-(--card-dark-purple)" />
            <Card icon={Outflow} title="Sortie totale" value="$67000" color="bg-(--card-orange)" />
            <Card icon={AgencyFees} title="Frais d'agence" value="$8,700" color="bg-(--card-lime)" />
            <Card icon={ManagementFees} title="Frais de gestion" value="$24,000" color="bg-(--card-blue)" />
            <Card icon={Deposit} title="Dépôt" value="$24,000" color="bg-(--card-green)" />
        </div>
    )
}
