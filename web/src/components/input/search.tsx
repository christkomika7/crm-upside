import { SearchIcon } from 'lucide-react'
import { Input } from '../ui/input'

type SearchProps = {
    placeholder?: string
    setSearch: ((updater: string) => void) | undefined
    search: string
}

export default function Search({ placeholder, setSearch, search }: SearchProps) {
    return (
        <div className='relative max-w-sm w-full'>
            <span className='absolute top-1/2 -translate-y-1/2 left-3'><SearchIcon className='size-3.5 text-neutral-400' /></span>
            <Input className='pl-8' placeholder={placeholder} value={search} onChange={(e) => {
                if (setSearch) setSearch(e.target.value);
            }} />
        </div>
    )
}
