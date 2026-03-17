import { BellIcon } from "lucide-react";

export default function Notification() {
    return (
        <div className="size-10 rounded-md bg-neutral-100 flex justify-center items-center relative">
            <span className="size-2 rounded-full bg-red-500 -top-0.5 -right-0.5 absolute"></span>
            <BellIcon className="size-5" />
        </div>
    )
}
