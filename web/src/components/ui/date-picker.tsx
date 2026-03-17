import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { fr } from "date-fns/locale"
import { CalendarDaysIcon } from "lucide-react"
import { Activity } from "react"

type DatePickerProps = {
    date?: Date;
    setDate: (...event: any[]) => void
    error?: boolean;
    hasIcon?: boolean
}

export function DatePicker({ date, setDate, error, hasIcon = false }: DatePickerProps) {
    return <Popover>
        <PopoverTrigger asChild>
            <Button
                aria-invalid={error}
                variant="date"
                data-empty={!date}
                className="flex justify-between"
            >
                {date ? format(date, "PPP", {
                    locale: fr
                }) : <span className="text-neutral-500">Sélectionner une date</span>}
                <Activity mode={hasIcon ? "visible" : "hidden"} >
                    <CalendarDaysIcon className="size-4 text-neutral-600" />
                </Activity>
            </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
    </Popover >

}