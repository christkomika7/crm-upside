import type { Building } from "./building";
import type { Rental } from "./rental";

export type ContractTab = {
    id: string;
    reference: string;
    type: "CONTRACT" | "MANDATE",
    status: "ACTIVE" | "CANCELLED" | "EXPIRED",
    isCanceled: boolean;
    isDeleting: boolean;
    issue: string;
    duration: string;
    rent: string
}

export type Contract = {
    id: string;
    type: "CONTRACT" | "MANDATE";
    start: Date;
    end: Date;
    disabled?: [Date, Date][];
    isCanceled: boolean;
    isDeleted: boolean;
    rentalId?: string;
    buildingId?: string;
    rental?: Rental;
    building?: Building;
    createdAt: Date;
}


export type ContractStats = {
    activeContracts: number;
    activeMandates: number;
    expired: number;
    canceled: number;
    total: number
}
