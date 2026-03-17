
export default function ReceivableList() {
    return (
        <div className="bg-white shadow-md shadow-neutral-300/20 rounded-md p-4">
            <div className="py-2 border-b border-neutral-200"><p className="font-medium  text-neutral-700">Receivables</p></div>
            <ul className="pt-3 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="flex justify-between text-neutral-600  items-center">
                        <span>Rent</span>
                        <span className="font-medium">$2,000</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
