import type { PropertyManagementSchemaType } from "@/lib/zod/property-management";

export const DEFAULT_VALUES: PropertyManagementSchemaType = {
    building: "",
    units: [],
    administrativeManagement: false,
    technicalManagement: false,
    services: [],
    start: new Date(),
    end: new Date(),
    active: false,
    observation: "",
}