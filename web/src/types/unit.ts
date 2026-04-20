import type { Building } from "./building";
import type { Type } from "./type";

export type Units = {
    id: string;
    reference: string;
    building: string;
    owner: string;
    tenant: string;
    status: string;
    isDeleting: boolean;
    rent: string;
    service: string;
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type Unit = {
    id: string;
    reference: string;
    rentalStatus: string;
    surface: number;
    livingroom: number;
    dining: number;
    kitchen: number;
    bedroom: number;
    bathroom: number;
    rent: number;
    furnished: string;
    wifi: boolean;
    water: boolean;
    electricity: boolean;
    tv: boolean;
    charges: string;
    extraCharges: string;
    buildingId: string;
    building: Building;
    service: string;
    status: "rented" | "vacant";
    typeId: string;
    type: Type;
    tenantName: string;
    tenantEmail: string;
    tenantContact: string;
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type UnitClient = Omit<Unit, "documents"> & {
    documents: File[]
}