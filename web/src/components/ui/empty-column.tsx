import { XIcon } from 'lucide-react'

export default function EmptyColumn() {
    return (
        <div className='-space-x-0.5 flex'>
            {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} className="flex">
                    <XIcon className="text-neutral-600 size-3" />
                </span>
            ))}
        </div>
    )
}
