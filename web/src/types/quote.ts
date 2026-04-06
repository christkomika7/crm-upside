import type { Item } from "./item";
import type { Owner } from "./owner";
import type { Tenant } from "./tenant";


export type QuoteStats = {
    total: number
    complete: number
    wait: number
    count: {
        total: number
        complete: number
        wait: number
    }
}

export type QuoteTab = {
    id: string;
    type: "OWNER" | "TENANT";
    reference: string;
    issue: Date;
    isDeleting: boolean;
    client: string;
    amount: string;
    due: Date;
}

export type Quote = {
    id: string;
    reference: string;
    price: string;
    discount: string;
    discountType: "PERCENT" | "MONEY";
    isComplete: boolean;
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


