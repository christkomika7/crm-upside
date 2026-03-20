export type ProductService = {
    id: string;
    reference: string;
    description: string;
    price: string;
    isDeleting: boolean;
    hasTax: boolean;
    createdAt: Date;
    updatedAt: Date;
}