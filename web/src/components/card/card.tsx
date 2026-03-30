import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { EyeIcon } from "lucide-react";
import { Activity } from "react";

type CardProps = {
    icon: string;
    title: string;
    value: string;
    color: string;
    isLoading?: boolean;
    status?: 'success' | 'warning' | 'default'
    view?: string;
}

function CardSkeleton() {
    return (
        <div className="bg-white flex items-center justify-between rounded-md p-4 shadow-md shadow-neutral-300/10">
            <div className="flex items-center gap-x-4">
                <div className="size-16 rounded-full bg-neutral-100 animate-pulse" />
                <div className="flex flex-col gap-2">
                    <div className="h-3 w-24 rounded-full bg-neutral-100 animate-pulse" />
                    <div className="h-4 w-32 rounded-full bg-neutral-100 animate-pulse" />
                </div>
            </div>
            <div className="size-8 rounded-md bg-neutral-100 animate-pulse" />
        </div>
    )
}

export default function Card({ icon, title, value, color, view, status = 'default', isLoading }: CardProps) {
    if (isLoading) return <CardSkeleton />

    return (
        <div className="bg-white flex items-center justify-between rounded-md p-4 shadow-md shadow-neutral-300/10">
            <div className="flex items-center gap-x-4">
                <div className={cn(`p-2 size-16 flex justify-center items-center rounded-full ${color}`)}>
                    <img src={icon} alt={title} className="size-8 object-contain object-center" />
                </div>
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className={cn("font-bold", {
                        'text-gray-900': status === 'default',
                        'text-emerald-500': status === 'success',
                        'text-red-500': status === 'warning',
                    })}>{value}</p>
                </div>
            </div>
            <Activity mode={view ? "visible" : "hidden"}>
                <Link to={view}>
                    <span className="bg-neutral-50 p-2 rounded-md flex">
                        <EyeIcon className="size-4 text-neutral-600" />
                    </span>
                </Link>
            </Activity>
        </div>
    )
}