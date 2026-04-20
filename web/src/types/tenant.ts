import type { PaymentMode } from "./enum";


export type TenantTab = {
    id: string;
    name: string;
    company: string;
    rentedUnit: number;
    monthlyRent: string;
    monthlyCharges: string;
    depositPaid: string;
    status: "OVERDUE" | "UP_TO_DATE";
    createdAt: Date;
}

export type Tenant = {
    id: string;
    isPersonal: boolean;
    isDiplomatic: boolean;
    firstname: string;
    lastname: string;
    company: string;
    phone: string;
    email: string;
    address: string;
    maritalStatus: string;
    income: string;
    paymentMode: PaymentMode[];
    bankInfo: string;
    documents: string[];
    updatedAt: Date;
    createdAt: Date
}

export type TenantClient = Omit<Tenant, "documents"> & {
    documents: File[]
}