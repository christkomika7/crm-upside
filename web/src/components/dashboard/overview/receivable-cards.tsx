import CardBalance from "@/components/card/card-balance";
import { reveivables } from "@/lib/data";

export default function ReceivableCards() {
    return (
        <div className="bg-white shadow-md shadow-neutral-300/20 rounded-md p-4 gap-4 grid grid-cols-3">
            {reveivables.map(d => (<CardBalance {...d} />))}
        </div>
    )
}
