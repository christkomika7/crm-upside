export type Owner = {
    id: string;
    reference: string;
    buildings: string[];
    properties: number;
    firstname: string;
    lastname: string;
    company: string;
    phone: string;
    email: string;
    address: string;
    bankInfo: string;
    actionnary: string;
    documents: string[];
    updatedAt: Date;
    createdAt: Date
}

export type OwnerClient = Omit<Owner, "documents"> & {
    documents: File[]
}