"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PencilIcon, XIcon, CalendarIcon } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { format, differenceInCalendarMonths } from "date-fns";
import { fr } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import type { Tax } from "@/types/tax";
import { calculateTaxes } from "@/lib/price";
import type { Item } from "@/types/item";

type ArticleListProps = {
    items: Item[];
    taxes?: Tax[];
    discount?: [number, "PERCENT" | "MONEY"];
    amountType?: "HT" | "TTC";
    onChange: (items: Item[]) => void;
    onChangePrice: (price: string) => void;
};

function monthsFromRange(start?: Date, end?: Date): number {
    if (!start || !end) return 1;
    const diff = differenceInCalendarMonths(end, start);
    return Math.max(1, diff);
}

export default function ArticleList({
    items,
    taxes = [],
    discount,
    amountType = "HT",
    onChange,
    onChangePrice,
}: ArticleListProps) {
    const [editingDescId, setEditingDescId] = useState<string | null>(null);

    function updateItem(
        id: string,
        field: keyof Item,
        value: number | string | Date | undefined
    ) {
        const updated = items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        onChange(updated);
    }

    function updateDateRange(id: string, range: DateRange | undefined) {
        const start = range?.from;
        const end = range?.to;
        const quantity = monthsFromRange(start, end);
        const updated = items.map((item) =>
            item.id === id ? { ...item, start, end, quantity } : item
        );
        onChange(updated);
    }

    function removeItem(id: string) {
        onChange(items.filter((item) => item.id !== id));
    }

    const normalizedItems = useMemo(
        () =>
            items.map((item) =>
                item.type === "UNIT"
                    ? {
                        ...item,
                        price:
                            item.price +
                            (item.charges ?? 0) +
                            (item.extraCharges ?? 0),
                    }
                    : item
            ),
        [items]
    );

    const result = useMemo(() => {
        if (!normalizedItems.length) return null;
        return calculateTaxes({
            items: normalizedItems,
            taxes: taxes ?? [],
            discount,
            amountType,
            taxOperation: "sequence",
        });
    }, [normalizedItems, taxes, discount, amountType]);

    if (!result) return null;

    const priceValue =
        amountType === "TTC"
            ? result.totalWithTaxes.toNumber()
            : result.totalWithoutTaxes.toNumber();

    useEffect(() => {
        onChangePrice(priceValue.toString());
    }, [priceValue]);

    const formatAmount = (d: { toNumber(): number }) =>
        d.toNumber().toLocaleString("fr-FR");

    return (
        <div className="space-y-2">
            {items.map((item) => {
                const isUnit = item.type === "UNIT";
                const unitPricePerMonth =
                    item.price + (item.charges ?? 0) + (item.extraCharges ?? 0);
                const subtotal = isUnit
                    ? unitPricePerMonth * item.quantity
                    : item.price * item.quantity;
                const dateRange: DateRange | undefined =
                    item.start || item.end
                        ? { from: item.start, to: item.end }
                        : undefined;
                const months = monthsFromRange(item.start, item.end);

                return (
                    <div key={item.id} className="group">
                        {item.hasTax && (
                            <div className="mb-1">
                                <Status variant="info">
                                    <StatusIndicator className="size-2" />
                                    <StatusLabel className="text-[11px]">Article taxé</StatusLabel>
                                </Status>
                            </div>
                        )}

                        <div className="relative border border-neutral-200 rounded-xl bg-white hover:border-neutral-300 transition-colors duration-150">
                            <button
                                onClick={() => removeItem(item.id)}
                                className="absolute cursor-pointer top-2.5 right-2.5 size-5 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-red-50 hover:text-red-500 text-neutral-400 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                            >
                                <XIcon className="size-3" />
                            </button>

                            <div className="px-4 pt-2.5 pb-2.5 border-b border-neutral-100">
                                <div className="flex items-start justify-between gap-2 pr-6">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <p className="text-sm font-medium text-neutral-800 leading-tight truncate">
                                            {item.reference}
                                        </p>
                                        {isUnit && (
                                            <span className="shrink-0 inline-flex items-center text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-500 border border-violet-100">
                                                Unité
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingDescId(editingDescId === item.id ? null : item.id)
                                        }
                                        className={cn(
                                            "shrink-0 flex cursor-pointer items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md transition-colors duration-150",
                                            editingDescId === item.id
                                                ? "text-emerald-600 bg-emerald-50"
                                                : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                                        )}
                                    >
                                        <PencilIcon className="size-2.5" />
                                        {editingDescId === item.id ? "Fermer" : "Modifier"}
                                    </button>
                                </div>

                                {editingDescId === item.id ? (
                                    <Textarea
                                        autoFocus
                                        value={item.description}
                                        onChange={(e) =>
                                            updateItem(item.id, "description", e.target.value)
                                        }
                                        placeholder="Description de l'article..."
                                        className="mt-2 text-xs text-neutral-600 resize-none min-h-16 bg-neutral-50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-emerald-200 focus-visible:border-emerald-300"
                                        rows={3}
                                    />
                                ) : item.description ? (
                                    <pre
                                        onClick={() => setEditingDescId(item.id)}
                                        className="whitespace-pre-wrap font-sans text-xs text-neutral-400 mt-1 leading-tight cursor-text hover:text-neutral-500 transition-colors"
                                    >
                                        {item.description}
                                    </pre>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setEditingDescId(item.id)}
                                        className="mt-1 cursor-pointer text-xs text-neutral-300 hover:text-neutral-400 transition-colors"
                                    >
                                        + Ajouter une description
                                    </button>
                                )}
                            </div>

                            {!isUnit && (
                                <div className="grid grid-cols-2">
                                    <div
                                        className={cn(
                                            "px-4 pt-3 pb-1 border-r border-neutral-100 relative",
                                            "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-200",
                                            "focus-within:after:bg-neutral-500"
                                        )}
                                    >
                                        <label className="block text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-1.5">
                                            Quantité
                                        </label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(item.id, "quantity", Number(e.target.value))
                                            }
                                            className="border-none shadow-none p-0 h-auto text-2xl font-medium text-neutral-800 bg-transparent focus-visible:ring-0 rounded-none w-full"
                                        />
                                        <div className="h-px mb-2" />
                                    </div>

                                    <div
                                        className={cn(
                                            "px-4 pt-3 pb-1 relative",
                                            "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-200",
                                            "focus-within:after:bg-neutral-500"
                                        )}
                                    >
                                        <label className="block text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-1.5">
                                            Prix unitaire
                                        </label>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xs text-neutral-400 shrink-0">FCFA</span>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={item.price}
                                                onChange={(e) =>
                                                    updateItem(item.id, "price", Number(e.target.value))
                                                }
                                                className="border-none shadow-none p-0 h-auto text-2xl font-medium text-neutral-800 bg-transparent focus-visible:ring-0 rounded-none w-full"
                                            />
                                        </div>
                                        <div className="h-px mb-2" />
                                    </div>
                                </div>
                            )}

                            {isUnit && (
                                <>
                                    <div className="px-4 pt-3 pb-3 border-b border-neutral-100">
                                        <label className="block text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-2">
                                            Période
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className={cn(
                                                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300 transition-colors text-left",
                                                        !dateRange?.from && "text-neutral-400"
                                                    )}
                                                >
                                                    <CalendarIcon className="size-3.5 text-neutral-400 shrink-0" />
                                                    <span className="text-sm font-medium text-neutral-700 flex-1">
                                                        {dateRange?.from ? (
                                                            dateRange.to ? (
                                                                <>
                                                                    {format(dateRange.from, "dd MMM yyyy", { locale: fr })}
                                                                    {" → "}
                                                                    {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                                                                </>
                                                            ) : (
                                                                format(dateRange.from, "dd MMM yyyy", { locale: fr })
                                                            )
                                                        ) : (
                                                            "Sélectionner une période"
                                                        )}
                                                    </span>
                                                    {months > 0 && dateRange?.from && dateRange?.to && (
                                                        <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-500">
                                                            {months} mois
                                                        </span>
                                                    )}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="range"
                                                    selected={dateRange}
                                                    onSelect={(range) => updateDateRange(item.id, range)}
                                                    locale={fr}
                                                    numberOfMonths={2}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {dateRange?.from && dateRange?.to && (
                                            <p className="mt-1.5 text-[10px] text-neutral-400">
                                                Quantité calculée : <span className="font-medium text-neutral-600">{months}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 divide-x divide-neutral-100">
                                        <div
                                            className={cn(
                                                "px-4 pt-3 pb-1 relative",
                                                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-200",
                                                "focus-within:after:bg-neutral-500"
                                            )}
                                        >
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-1.5">
                                                Prix / mois
                                            </label>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[10px] text-neutral-400 shrink-0">FCFA</span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "price", Number(e.target.value))
                                                    }
                                                    className="border-none shadow-none p-0 h-auto text-xl font-medium text-neutral-800 bg-transparent focus-visible:ring-0 rounded-none w-full"
                                                />
                                            </div>
                                            <div className="h-px mb-2" />
                                        </div>

                                        <div
                                            className={cn(
                                                "px-4 pt-3 pb-1 relative",
                                                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-200",
                                                "focus-within:after:bg-amber-400"
                                            )}
                                        >
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-1.5">
                                                Charges
                                            </label>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[10px] text-neutral-400 shrink-0">FCFA</span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={item.charges ?? ""}
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "charges",
                                                            e.target.value === "" ? undefined : Number(e.target.value)
                                                        )
                                                    }
                                                    className="border-none shadow-none p-0 h-auto text-xl font-medium text-neutral-800 bg-transparent focus-visible:ring-0 rounded-none w-full placeholder:text-neutral-300"
                                                />
                                            </div>
                                            <div className="h-px mb-2" />
                                        </div>

                                        <div
                                            className={cn(
                                                "px-4 pt-3 pb-1 relative",
                                                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-200",
                                                "focus-within:after:bg-orange-400"
                                            )}
                                        >
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-1.5">
                                                Charges supp.
                                            </label>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[10px] text-neutral-400 shrink-0">FCFA</span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={item.extraCharges ?? ""}
                                                    placeholder="0"
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "extraCharges",
                                                            e.target.value === "" ? undefined : Number(e.target.value)
                                                        )
                                                    }
                                                    className="border-none shadow-none p-0 h-auto text-xl font-medium text-neutral-800 bg-transparent focus-visible:ring-0 rounded-none w-full placeholder:text-neutral-300"
                                                />
                                            </div>
                                            <div className="h-px mb-2" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="px-4 py-2.5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50 rounded-b-xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-neutral-400">Sous-total</span>
                                    {isUnit && dateRange?.from && dateRange?.to && (
                                        <span className="text-[10px] text-neutral-400">
                                            ({months} mois × {unitPricePerMonth.toLocaleString("fr-FR")} FCFA)
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-neutral-700">
                                    {subtotal.toLocaleString("fr-FR")} FCFA
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {items.length > 0 && (
                <div className="mt-3 rounded-xl border border-neutral-200 bg-white overflow-hidden">
                    <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-400">Sous-total HT</span>
                        <span className="text-sm font-medium text-neutral-700">
                            {formatAmount(result.SubTotal)} FCFA
                        </span>
                    </div>

                    {result.discountAmount.greaterThan(0) && (
                        <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                            <span className="text-xs text-neutral-400">
                                Remise ({discount && discount[0]}
                                {discount && discount[1] === "MONEY" ? " FCFA" : "%"})
                            </span>
                            <span className="text-sm font-medium text-red-500">
                                {formatAmount(result.discountAmount)} FCFA
                            </span>
                        </div>
                    )}

                    <Activity mode={amountType === "TTC" ? "visible" : "hidden"}>
                        {result.taxes.map((t: any) =>
                            t.totalTax.greaterThan(0) ? (
                                <div key={t.taxName} className="px-4 py-2 border-b border-neutral-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-400">
                                            {t.taxName}{" "}
                                            {t.appliedRates.length > 0 && (
                                                <span className="text-neutral-300">
                                                    ({t.appliedRates.join(" + ")}%)
                                                </span>
                                            )}
                                        </span>
                                        {t.cumulsDetails && t.cumulsDetails.length > 0 ? (
                                            <span className="text-xs font-medium text-neutral-700">
                                                {formatAmount({ toNumber: () => t.totalTaxMain })} FCFA
                                            </span>
                                        ) : (
                                            <span className="text-sm font-medium text-neutral-700">
                                                {formatAmount({ toNumber: () => t.totalTax })} FCFA
                                            </span>
                                        )}
                                    </div>
                                    {t.cumulsDetails && t.cumulsDetails.length > 0 && (
                                        <div className="mt-1 space-y-0.5 pl-2 border-l border-neutral-200">
                                            {t.cumulsDetails.map((c: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-[11px]">
                                                    <span className="text-neutral-400">+ {c.from} ({c.rate}%)</span>
                                                    <span className="text-neutral-500">
                                                        {formatAmount({ toNumber: () => c.amount })} FCFA
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null
                        )}
                    </Activity>

                    <div className="px-4 py-3 bg-neutral-50 flex items-center justify-between">
                        <span className="text-sm font-semibold text-neutral-800">
                            Total {amountType}
                        </span>
                        <span className="text-base font-semibold text-neutral-900">
                            {formatAmount(result.currentPrice)} FCFA
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}