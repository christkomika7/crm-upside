import Card from "@/components/card/card";
import EditList from "@/assets/icons/contract/edit-document.png";
import DeleteList from "@/assets/icons/contract/delete-list.png";
import WarningAlert from "@/assets/icons/contract/warning-alert.png";
import UserInfo from "@/assets/icons/contract/user-info.png";


export default function ContractCards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card icon={EditList} title="Contrats actifs" value="85" color="bg-(--card-green)" />
            <Card icon={WarningAlert} title="Bientôt expiré" value="10" color="bg-(--card-blue)" />
            <Card icon={DeleteList} title="Résilié" value="5" color="bg-(--card-red)" />
            <Card icon={UserInfo} title="Mandats en cours" value="20" color="bg-(--card-orange)" />
        </div>
    )
}
