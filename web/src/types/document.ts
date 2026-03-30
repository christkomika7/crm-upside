import type { Item } from "./item";
import type { Tax } from "./tax";

export type Document = {
    id?: string;
    reference: string;
    type: "OWNER" | "TENANT";
    taxes: Tax[];
    discount: number;
    discountType: "PERCENT" | "MONEY";
    amountType: "HT" | "TTC";
    issue: string;
    due: string;
    amount: string;
    amountPaid: string;
    status: string;
    items: Item[];
    note: string;
    isDeleting: boolean;
    upside: {
        design: {
            logo: string;
            position: "LEFT" | "RIGHT" | "MIDDLE";
            size: "SMALL" | "MEDIUM" | "LARGE";
            background: string;
            line: string;
        };

        client: {
            name: string;
            company: string;
            email: string;
            address: string;
        };

        company: string;
        address: string;
        city: string;
        country: string;
        bp: string;
        email: string;
        website: string;
        phone: string;
        rccm: string;
        nif: string;
    };

    createdAt: Date;
};