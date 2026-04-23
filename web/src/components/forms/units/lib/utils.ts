import type { UnitSchemaType } from "@/lib/zod/units";

export const DEFAULT_VALUES: UnitSchemaType = {
    type: "",
    reference: "",
    building: "",
    rentalStatus: "FREE",
    surface: 0,
    livingroom: 0,
    rent: 0,
    dining: 0,
    kitchen: 0,
    bedroom: 0,
    bathroom: 0,
    furnished: "",
    wifi: false,
    water: false,
    electricity: false,
    tv: false,
    description: "",
    charges: "",
    extraCharges: "",
    documents: [],
}