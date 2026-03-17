import { ExpandIcon } from "lucide-react";

export default function Intervention() {
    return (
        <div className="bg-white flex flex-col justify-between shadow-md shadow-neutral-300/20 rounded-md p-4">
            <div className="flex mb-4 gap-x-2 items-center">
                <span className="size-7 flex bg-neutral-100 rounded-full justify-center items-center">
                    <ExpandIcon className="size-3.5" />
                </span>
                <p className="font-medium">Interventions</p>
            </div>
            <ul className="space-y-3">
                <li className="flex gap-x-1 justify-between items-center text-sm">
                    Ongoing Technical
                    <span className="font-medium">2</span>
                </li>
                <li className="flex gap-x-1 justify-between items-center text-sm">
                    Urgent
                    <span className="font-medium">5</span>
                </li>
                <li className="flex gap-x-1 justify-between items-center text-sm">
                    Low
                    <span className="font-medium">3</span>
                </li>
            </ul>
        </div>
    )
}
