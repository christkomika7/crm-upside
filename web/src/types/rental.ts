import type { Unit } from "./unit";

export type Rental = {
    id: string;
    reference: string;
    price: string;
    start: Date;
    end: Date;
    buildingId: string;
    tenantId: string;
    unitId: string;
    unit: Unit
    updatedAt: Date;
    createdAt: Date
}

