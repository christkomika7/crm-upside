import type { PersonalService } from "./personal-service";

export type PropertyManagementTab = {
    id: string;
    name: string;
    unit: string;
    management: string;
    services: string;
    commission: string;
    createdAt: Date;
}

export type PropertyManagement = {
    id: string;
    buildingId: string;
    units: string[];
    administrativeManagement: boolean;
    technicalManagement: boolean;
    services: PersonalService[];
    observations?: string;
    start: Date;
    end: Date;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}