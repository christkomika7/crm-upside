import { format, isWithinInterval, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { fr } from "date-fns/locale"
import { CalendarDaysIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { normalizeDate } from "@/lib/utils"

type DisabledRange = [Date] | [Date, Date]

type DatePickerBase = {
    error?: boolean
    hasIcon?: boolean
    disabled?: boolean
    disabledRanges?: DisabledRange[]
}

type DatePickerSingle = DatePickerBase & {
    type?: "single"
    date?: Date
    setDate: (date: Date | undefined) => void
}

type DatePickerMultiple = DatePickerBase & {
    type: "multiple"
    date?: Date[]
    setDate: (date: Date[] | undefined) => void
}

type DatePickerRange = DatePickerBase & {
    type: "range"
    date?: DateRange
    setDate: (date: DateRange | undefined) => void
}

type DatePickerProps = DatePickerSingle | DatePickerMultiple | DatePickerRange

function formatDate(date: DatePickerProps["date"]): string | null {
    if (!date) return null

    if (date instanceof Date) {
        return format(date, "PPP", { locale: fr })
    }

    if (Array.isArray(date)) {
        if (date.length === 0) return null
        if (date.length === 1) return format(date[0], "PPP", { locale: fr })
        return `${date.length} dates sélectionnées`
    }

    if (date.from && date.to) {
        return `${format(date.from, "PPP", { locale: fr })} – ${format(date.to, "PPP", { locale: fr })}`
    }
    if (date.from) {
        return format(date.from, "PPP", { locale: fr })
    }

    return null
}

export function DatePicker(props: DatePickerProps) {
    const { date, error, disabled = false, hasIcon = false, disabledRanges = [] } = props
    const formattedDate = formatDate(date)

    function isDisabled(day: Date): boolean {
        const normalizedDay = normalizeDate(day)
        return disabledRanges.some((range) => {
            if (range.length === 1) {
                return isSameDay(normalizedDay, normalizeDate(range[0]))
            }
            return isWithinInterval(normalizedDay, {
                start: normalizeDate(range[0]),
                end: normalizeDate(range[1]),
            })
        })
    }
    const calendarProps = (() => {
        if (props.type === "multiple") {
            return {
                mode: "multiple" as const,
                selected: props.date,
                onSelect: props.setDate,
                disabled: isDisabled,
            }
        }
        if (props.type === "range") {
            return {
                mode: "range" as const,
                selected: props.date,
                onSelect: props.setDate,
                disabled: isDisabled,
            }
        }
        return {
            mode: "single" as const,
            selected: props.date,
            onSelect: props.setDate,
            disabled: isDisabled,
        }
    })()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    aria-invalid={error}
                    variant="date"
                    data-empty={!formattedDate}
                    disabled={disabled}
                    className="flex justify-between"
                >
                    {formattedDate
                        ? <span>{formattedDate}</span>
                        : <span className="text-neutral-500">Sélectionner une date</span>
                    }
                    {hasIcon && (
                        <CalendarDaysIcon className="size-4 text-neutral-600" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
                <Calendar {...calendarProps} />
            </PopoverContent>
        </Popover>
    )
}