import type { LotType } from "./lot-type";

export type Building = {
    id: string;
    reference: string;
    location: string;
    name: string;
    owner: string;
    unit: string;
    occupancy: string;
    constructionDate: Date;
    door: number;
    parkingPrice: number;
    security: boolean;
    camera: boolean;
    elevator: boolean;
    parking: boolean;
    pool: boolean;
    generator: boolean;
    waterBorehole: boolean;
    gym: boolean;
    garden: boolean;
    status: string[];
    map: string;
    photos: string[];
    deeds: string[];
    documents: string[];
    lotTypes: LotType[];
    isDeleting: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type BuildingClient = Omit<Building, "photos" | "deeds" | "documents"> & {
    photos: File[]
    deeds: File[]
    documents: File[]
}