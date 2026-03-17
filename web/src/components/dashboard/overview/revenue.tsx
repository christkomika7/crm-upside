import { ExpandIcon } from "lucide-react";

export default function Revenue() {
    return (
        <div className="bg-white shadow-md shadow-neutral-300/20 rounded-md p-4">
            <div className="flex items-center justify-between gap-x-2">
                <div className="flex mb-2 gap-x-2 items-center">
                    <span className="size-7 flex bg-neutral-100 rounded-full justify-center items-center">
                        <ExpandIcon className="size-3.5" />
                    </span>
                    <p className="font-medium">Revenue Trends</p>
                </div>
                <ul className="flex items-center space-x-3">
                    <li className="flex gap-x-1 items-center text-sm">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        Agency Fees
                    </li>
                    <li className="flex gap-x-1 items-center text-sm">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        Managmeent & Other
                    </li>
                </ul>
            </div>
            <div className="h-52.5 bg-neutral-300"></div>
        </div>
    )
}
