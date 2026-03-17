export type Tenant = {
    id: string;
    firstname: string;
    lastname: string;
    company: string;
    phone: string;
    email: string;
    address: string;
    maritalStatus: string;
    income: string;
    paymentMode: string;
    bankInfo: string;
    documents: string[];
    updatedAt: Date;
    createdAt: Date
}

export type TenantClient = Omit<Tenant, "documents"> & {
    documents: File[]
}