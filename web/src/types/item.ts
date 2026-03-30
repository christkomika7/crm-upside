export type Item = {
    id: string;
    productServiceId?: string;
    reference: string;
    description: string;
    price: number;
    quantity: number;
    hasTax: boolean;
    discount?: number;
    discountType?: "PERCENT" | "MONEY";
};