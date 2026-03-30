import type Decimal from "decimal.js";
import type { Item } from "./item";

export type Cumul = {
    id: string;
    name: string;
    value: string;
};

export type Tax = {
    id: string;
    name: string;
    value: string;
    cumuls: Cumul[];
};

export type CumulDetail = {
    from: string;
    rate: number;
    amount: number;
};

export type TaxResult = {
    taxName: string;
    appliedRates: number[];
    totalTax: Decimal;
    taxPrice: Decimal;
    totalTaxMain: Decimal;
    cumulsDetails: CumulDetail[];
};


export type CalculateTaxesResult = {
    taxes: TaxResult[];
    totalTax: Decimal;
    totalWithTaxes: Decimal;
    totalWithoutTaxes: Decimal;
    currentPrice: Decimal;
    SubTotal: Decimal;
    subTotal: Decimal;
    subtotal: Decimal;
    discountAmount: Decimal;
};

export type CalculateTaxesInput = {
    items: Item[];
    taxes: Tax[];
    amountType?: "HT" | "TTC";
    taxOperation: "sequence" | "cumul";
    discount?: [number, "PERCENT" | "MONEY"]
};
