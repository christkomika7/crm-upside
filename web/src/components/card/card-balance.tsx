import { Activity } from "react";
import Cash from "@/assets/icons/cash.png";
import Bank from "@/assets/icons/bank.png";

const CardBalanceColor = {
    RED: 0
};

export type CardBalanceProps = {
    id: string;
    icon?: "cash" | "bank",
    value: string | string[];
    title: string;
    hasIcon?: boolean
}

export default function CardBalance({ icon, value, title, hasIcon = true }: CardBalanceProps) {
    CardBalanceColor.RED
    return (
        <div className="bg-pink-200/50 text-white p-6 rounded-md flex flex-col justify-center items-center min-h-30">
            <Activity mode={Array.isArray(value) && value.length === 2 ? "visible" : "hidden"}>
                <div className="space-y-0.5">
                    <p className="font-bold text-xl text-emerald-600">{Array.isArray(value) && value[0]} <span className="text-sm">(Incoming)</span> </p>
                    <p className="font-bold text-xl text-red-600">{Array.isArray(value) && value[1]} <span className="text-sm">(Outgoing)</span></p>
                </div>
            </Activity>
            <Activity mode={Array.isArray(value) && value.length === 2 ? "hidden" : "visible"} >
                <Activity mode={hasIcon ? "visible" : "hidden"}>
                    <span className="size-12 rounded-full shadow-xl shadow-neutral-300/50 bg-white text-black flex justify-center items-center mb-2">
                        <img src={icon === "cash" ? Cash : Bank} alt={icon === "cash" ? "Cash icon" : "Bank icon"} className="size-6" />
                    </span>
                </Activity>
                <p className="font-bold text-2xl text-pink-800 mb-2">{value}</p>
            </Activity>
            <p className="text-sm font-medium text-neutral-700">{title}</p>
        </div>
    )
}
