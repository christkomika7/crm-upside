export const DeletionType = {
    OWNER: "OWNER",
    BUILDING: "BUILDING",
    TENANT: "TENANT",
    UNIT: "UNIT",
    RENTAL: "RENTAL",
    RESERVATION: "RESERVATION",
    PROPERTY_MANAGEMENT: "PROPERTY_MANAGEMENT",
    INVOICING: "INVOICING",
    QUOTE: "QUOTE",
    CONTRACT: "CONTRACT",
    CHECK_IN: "CHECK_IN",
    APPOINTMENT: "APPOINTMENT",
    SERVICE_PROVIDER: "SERVICE_PROVIDER",
    COMMUNICATION: "COMMUNICATION",
} as const


export type DeletionKey = keyof typeof DeletionType;

export type Deletion = {
    id: string;
    reference: string;
    name: string;
    date: string;
    actionBy: string;
}