import { ExpandIcon } from "lucide-react";

export default function Expense() {
    return (
        <div className="bg-white shadow-md shadow-neutral-300/20 rounded-md p-4">
            <div className="flex mb-2 gap-x-2 items-center">
                <span className="size-7 flex bg-neutral-100 rounded-full justify-center items-center">
                    <ExpandIcon className="size-3.5" />
                </span>
                <p className="font-medium">Expense Status (40%)</p>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
                <ul className="space-y-3">
                    <li className="flex gap-x-1 items-center text-sm">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        Operations (40%)
                    </li>
                    <li className="flex gap-x-1 items-center text-sm">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        Travel (28%)
                    </li>
                    <li className="flex gap-x-1 items-center text-sm">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        Fuel Cost (22%)
                    </li>
                    <li className="flex gap-x-1 items-center text-sm">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        Telecom (10%)
                    </li>
                </ul>
                <div className="size-52.5 bg-neutral-300"></div>
            </div>
        </div>
    )
}
