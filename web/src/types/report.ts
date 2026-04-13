import type { Tenant } from "./tenant";
import type { Unit } from "./unit";

export type ReportTab = {
    id: string;
    date: string;
    tenant: string;
    building: string;
    unit: string;
    isChecked: boolean;
    isDeleting: boolean;
    status: "CHECKED_IN" | "CHECKED_OUT"
}

export type Report = {
    id: string;
    isChecked: boolean;
    tenantId: string;
    tenant: Tenant;
    unitId: string;
    unit: Unit;
    date: Date;
    note?: string;
    documents: string[];
}


export type ReportFile = Omit<Report, "documents"> & {
    documents: File[]
}