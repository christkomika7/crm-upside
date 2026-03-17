import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { EyeIcon } from "lucide-react";
import { Activity } from "react";

type CardProps = {
    icon: string;
    title: string;
    value: string;
    color: string;
    status?: 'success' | 'warning' | 'default'
    view?: string
}

export default function Card({ icon, title, value, color, view, status = 'default' }: CardProps) {
    return (
        <div className="bg-white flex items-center justify-between rounded-md p-4 shadow-md shadow-neutral-300/10">
            <div className="flex items-center gap-x-4">
                <div className={cn(`p-2 size-16 flex justify-center items-center rounded-full ${color}`)}>
                    <img src={icon} alt={title} className="size-8 object-contain object-center" />
                </div>
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className={cn(" font-bold",
                        {
                            'text-gray-900': status === 'default',
                            'text-emerald-500': status === 'success',
                            'text-red-500': status === 'warning',
                        }
                    )}>{value}</p>
                </div>
            </div>
            <Activity mode={view ? "visible" : "hidden"}>
                <Link to={view} >
                    <span className="bg-neutral-50 p-2 rounded-md flex"><EyeIcon className="size-4 text-neutral-600" /></span>
                </Link>
            </Activity>
        </div>
    )
}
