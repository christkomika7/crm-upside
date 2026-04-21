import type { Tenant } from "./tenant";
import type { Unit } from "./unit";

export type Rental = {
    id: string;
    reference: string;
    price: string;
    charges: string;
    extrasCharges: string;
    furnished: string;
    start: Date;
    end: Date;
    buildingId: string;
    tenantId: string;
    tenant: Tenant;
    unitId: string;
    unit: Unit
    updatedAt: Date;
    createdAt: Date
}

