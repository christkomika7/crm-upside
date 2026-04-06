export type ServiceProviderTab = {
    id: string;
    name: string;
    profession: string;
    isDeleting: boolean;
    rating: number;
    phone: string;
    email: string;
    due: string;
    paid: string;
    createdAt: Date;
}

export type ServiceProvider = {
    id: string;
    firstname: string;
    lastname: string;
    company: string;
    phone: string;
    email: string;
    address: string;
    professionId: string;
    nif: string;
    registerNumber: string;
    paymentMode: string;
    note: number;
    comment: string;
    rcc: string;
    idCard: string;
    taxCertificate: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ServiceProviderForm = Omit<ServiceProvider, "rcc" | "idCard" | "taxCertificate"> & {
    rcc: File[]
    idCard: File[]
    taxCertificate: File[]
}