import Card from "@/components/card/card";
import Key from "@/assets/icons/keys.png";
import Pocket from "@/assets/icons/pocket.png";
import Task from "@/assets/icons/task.png";


export default function PropertyCards() {
    return (
        <div className="grid grid-cols-5 gap-4">
            <Card icon={Task} title="Manage buildings" value="12" color="bg-(--card-purple)" />
            <Card icon={Key} title="Manage Units" value="44" color="bg-(--card-blue)" />
            <Card icon={Pocket} title="No. of Co-wners" value="10/2" color="bg-(--card-lime)" />
            <Card icon={Pocket} title="Total % of Rent" value="80%" color="bg-(--card-lime)" />
            <Card icon={Pocket} title="Total Rent" value="$1,20,000" color="bg-(--card-lime)" />
        </div>
    )
}
