import type { Type } from "./type";

export type Units = {
    id: string;
    reference: string;
    building: string;
    owner: string;
    tenant: string;
    status: string;
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
    rooms: number;
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
    buildingId: string;
    typeId: string;
    type: Type;
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type UnitClient = Omit<Unit, "documents"> & {
    documents: File[]
}