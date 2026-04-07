"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { cn } from "@/lib/utils";
import { PencilIcon, XIcon } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
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

export default function ArticleList({
    items,
    taxes = [],
    discount,
    amountType = "HT",
    onChange,
    onChangePrice
}: ArticleListProps) {

    const [editingDescId, setEditingDescId] = useState<string | null>(null);

    function updateItem(
        id: string,
        field: "price" | "quantity" | "description",
        value: number | string
    ) {
        const updated = items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        onChange(updated);
    }

    function removeItem(id: string) {
        onChange(items.filter((item) => item.id !== id));
    }

    const result = useMemo(() => {
        if (!items.length) return null
        return calculateTaxes({
            items,
            taxes: taxes ?? [],
            discount,
            amountType,
            taxOperation: "sequence"
        })
    }, [items, taxes, discount, amountType])

    if (!result) return null

    const priceValue = amountType === "TTC"
        ? result.totalWithTaxes.toNumber()
        : result.totalWithoutTaxes.toNumber()

    useEffect(() => {
        onChangePrice(priceValue.toString())
    }, [priceValue])

    const formatAmount = (d: { toNumber(): number }) =>
        d.toNumber().toLocaleString("fr-FR");

    return (
        <div className="space-y-2">
            {items.map((item) => {
                const subtotal = item.price * item.quantity;

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
                                    <p className="text-sm font-medium text-neutral-800 leading-tight">
                                        {item.reference}
                                    </p>
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

                            <div className="px-4 py-2.5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50 rounded-b-xl">
                                <span className="text-xs text-neutral-400">Sous-total</span>
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
                            <span className="text-xs text-neutral-400">Remise ({discount && discount[0]}{discount && discount[1] === "MONEY" ? " FCFA" : "%"})</span>
                            <span className="text-sm font-medium text-red-500">
                                {formatAmount(result.discountAmount)} FCFA
                            </span>
                        </div>
                    )}

                    <Activity mode={amountType === "TTC" ? "visible" : "hidden"} >
                        {result.taxes.map((t: any) =>
                            t.totalTax.greaterThan(0) ? (
                                <div key={t.taxName} className="px-4 py-2 border-b border-neutral-100">
                                    {/* Ligne principale */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-400">
                                            {t.taxName}{" "}
                                            {t.appliedRates.length > 0 && (
                                                <span className="text-neutral-300">
                                                    ({t.appliedRates.join(" + ")}%)
                                                </span>
                                            )}
                                        </span>

                                        {/* Si cumuls existent : afficher montant principal + cumul */}
                                        {t.cumulsDetails && t.cumulsDetails.length > 0 ? (
                                            <span className="text-xs font-medium text-neutral-700">
                                                {formatAmount({ toNumber: () => t.totalTaxMain })} FCFA
                                                {/* 
                                                +{" "}
                                                {formatAmount({
                                                    toNumber: () =>
                                                        t.cumulsDetails.reduce(
                                                            (acc: number, c: any) => acc + c.amount,
                                                            0
                                                        ),
                                                })}
                                                FCFA */}
                                            </span>
                                        ) : (
                                            <span className="text-sm font-medium text-neutral-700">
                                                {formatAmount({ toNumber: () => t.totalTax })} FCFA
                                            </span>
                                        )}
                                    </div>

                                    {/* Cumuls */}
                                    {t.cumulsDetails && t.cumulsDetails.length > 0 && (
                                        <div className="mt-1 space-y-0.5 pl-2 border-l border-neutral-200">
                                            {t.cumulsDetails.map((c: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between text-[11px]"
                                                >
                                                    <span className="text-neutral-400">
                                                        + {c.from} ({c.rate}%)
                                                    </span>
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