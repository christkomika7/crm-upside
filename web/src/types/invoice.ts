import type { Item } from "./item";
import type { Owner } from "./owner";
import type { Tenant } from "./tenant";

export type InvoiceStats = {
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

export type InvoiceTab = {
    id: string;
    type: "OWNER" | "TENANT";
    reference: string;
    issue: Date;
    isDeleting: boolean;
    client: string;
    amount: string;
    amountPaid: string;
    status: "PAID" | "PENDING" | "OVERDUE";
    due: Date;
}

export type Invoice = {
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
    type: "OWNER" | "TENANT";
    ownerId?: string;
    tenantId?: string;
    owner?: Owner;
    tenant?: Tenant;
    items: Item[];
}


