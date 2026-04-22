export type Item = {
    id: string;
    type: "ITEM" | "UNIT";
    productServiceId?: string;
    unitId?: string;
    reference: string;
    description: string;
    price: number;
    charges?: number
    extraCharges?: number
    quantity: number;
    hasTax: boolean;
    start?: Date
    end?: Date
    discount?: number;
    discountType?: "PERCENT" | "MONEY";
};

export type Article = {
    id: string;
    reference: string;
    description: string;
    rent?: string;
    price?: string;
    charges?: string
    extraCharges?: string
    start?: Date;
    end?: Date;
    hasTax: boolean;
    createdAt: Date;
    updatedAt: Date;
}