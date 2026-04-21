import Card from "@/components/card/card";
import Piece from "@/assets/icons/service-provider/piece.png";
import Note from "@/assets/icons/service-provider/note.png";
import Task from "@/assets/icons/service-provider/task.png";

export default function InfosProviderCards({ id }: { id: string }) {
    console.log(id)
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card icon={Piece} title="Montant Total Dû" value="$12,500" color="bg-(--card-purple)" />
            <Card icon={Note} title="Bon de Commande Actif" value="32" color="bg-(--card-blue)" />
            <Card icon={Task} title="Affectations en Attente" value="12" color="bg-(--card-lime)" />
        </div>
    )
}
