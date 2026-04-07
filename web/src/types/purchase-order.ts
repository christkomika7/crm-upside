import type { Item } from "./item";
import type { ServiceProvider } from "./service-provider";

export type PurchaseOrderStats = {
    total: number
    paid: number
    unpaid: number
    due: number
    count: {
        total: number
        paid: number
        pending: number
        overdue: number
    }
}

export type PurchaseOrderTab = {
    id: string;
    reference: string;
    issue: Date;
    isDeleting: boolean;
    serviceProvider: string;
    amount: string;
    amountPaid: string;
    status: "PAID" | "PENDING" | "OVERDUE";
    due: Date;
}

export type PurchaseOrder = {
    id: string;
    reference: string;
    price: string;
    amountPaid: string;
    discount: string;
    discountType: "PERCENT" | "MONEY";
    status: "PAID" | "PENDING" | "OVERDUE";
    start: Date;
    end: Date;
    note: string;
    hasTax: boolean;
    serviceProviderId: string;
    serviceProvider: ServiceProvider;
    items: Item[];
}


