import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface InputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  suffix?: string
  value?: string | number
  integer?: boolean
  padded?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const INVISIBLE_SPACES = /[\s\u00a0\u202f\u2009\u2007\u200b\u2060]/g

function formatNumber(value: string, integer?: boolean, padded?: boolean): string {
  const raw = value.replace(INVISIBLE_SPACES, "")
  if (raw === "" || raw === "-") return raw
  const num = Number(raw)
  if (isNaN(num)) return value
  if (padded) {
    return String(Math.floor(num)).padStart(2, "0")
  }
  return new Intl.NumberFormat("fr-FR", {
    useGrouping: true,
    maximumFractionDigits: integer ? 0 : 20,
  })
    .format(num)
    .replace(/\u202f/g, "\u00a0")
}

function unformatNumber(value: string): string {
  return value
    .replace(INVISIBLE_SPACES, "")
    .replace(",", ".")
}

function isIncompleteDecimal(value: string, integer?: boolean): boolean {
  if (integer) {
    return value === "-" || value === ""
  }
  return (
    value.endsWith(".") ||
    value.endsWith(",") ||
    /[.,]\d*0$/.test(value) ||
    value === "-" ||
    value === ""
  )
}

function isWithinBounds(
  unformatted: string,
  min?: number,
  max?: number
): boolean {
  if (unformatted === "" || unformatted === "-") return true
  const num = Number(unformatted)
  if (isNaN(num)) return false
  if (min !== undefined && num < min) return false
  if (max !== undefined && num > max) return false
  return true
}

function Input({ className, type, suffix, value, padded, integer, min, max, onChange, ...props }: InputProps) {
  const isNumber = type === "number"

  const minNum = min !== undefined ? Number(min) : undefined
  const maxNum = max !== undefined ? Number(max) : undefined

  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (isNumber && value !== undefined && value !== "") {
      return formatNumber(String(value), integer, padded)
    }
    return value !== undefined ? String(value) : ""
  })

  const isUserTyping = useRef(false)

  useEffect(() => {
    if (!isNumber || isUserTyping.current) return

    if (value !== undefined) {
      const strValue = String(value)
      const currentUnformatted = unformatNumber(displayValue)
      if (currentUnformatted === strValue && isIncompleteDecimal(displayValue, integer)) return

      setDisplayValue(value === "" ? "" : formatNumber(strValue, integer, padded))
    }
  }, [value, isNumber])

  useEffect(() => {
    if (!isNumber) {
      setDisplayValue(value !== undefined ? String(value) : "")
    }
  }, [value, isNumber])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isNumber) {
      onChange?.(e)
      return
    }

    const raw = e.target.value
    const cursorPos = e.target.selectionEnd ?? raw.length

    const normalized = raw.replace(",", ".")
    const unformatted = unformatNumber(normalized)

    // Validation format
    const integerPattern = /^-?\d*$/
    const decimalPattern = /^-?\d*\.?\d*$/
    const isValid =
      unformatted === "" ||
      unformatted === "-" ||
      (integer ? integerPattern.test(unformatted) : decimalPattern.test(unformatted))

    if (!isValid) return

    // Validation min/max — bloque si hors intervalle (sauf valeur incomplète)
    const isComplete = unformatted !== "" && unformatted !== "-" && !unformatted.endsWith(".")
    if (isComplete && !isWithinBounds(unformatted, minNum, maxNum)) return

    const incomplete = isIncompleteDecimal(unformatted, integer)

    const formatted = incomplete
      ? unformatted.replace(".", ",")
      : formatNumber(unformatted, integer, padded)

    isUserTyping.current = true
    setDisplayValue(formatted)

    const cursorOffset = formatted.length - raw.length
    const nextPos = Math.max(0, cursorPos + cursorOffset)
    requestAnimationFrame(() => {
      e.target.setSelectionRange(nextPos, nextPos)
      isUserTyping.current = false
    })

    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: unformatted },
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
  }

  const inputEl = (
    <input
      type={isNumber ? "text" : type}
      inputMode={isNumber ? (integer ? "numeric" : "decimal") : undefined}
      data-slot="input"
      value={isNumber ? displayValue : (value !== undefined ? String(value) : "")}
      onChange={handleChange}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-emerald-background focus-visible:ring-emerald-background/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-[3px]",
        className
      )}
      {...props}
    />
  )

  if (!suffix) return inputEl

  return (
    <div className="flex w-full items-center gap-x-2">
      {inputEl}
      <span
        className={cn(
          "border-input text-neutral-800 dark:bg-input/30 inline-flex h-10 shrink-0 items-center rounded-md border px-3 text-sm select-none",
          "transition-[color,box-shadow]"
        )}
      >
        {suffix}
      </span>
    </div>
  )
}

export { Input }
export type { InputProps }