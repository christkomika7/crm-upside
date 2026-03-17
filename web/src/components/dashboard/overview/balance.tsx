import CardBalance from "@/components/card/card-balance";
import { balances } from "@/lib/data";

export default function Balance() {
    return (
        <div className="bg-white shadow-md shadow-neutral-300/20 rounded-md">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-lg font-medium">Balance</h2>
                <span className="text-sm font-medium">1 234,56 €</span>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4">
                {balances.map((balance) => (
                    <CardBalance key={balance.id} icon={balance.icon} value={Array.isArray(balance.value) ? [String(balance.value[0]), String(balance.value[1])] : balance.value} title={balance.title} id={balance.id} />
                ))}
            </div>
        </div>
    )
}
