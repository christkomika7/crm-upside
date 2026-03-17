import { z } from "zod";

export const actions = ["read", "create", "update"] as const;
export type ActionType = (typeof actions)[number];

const actionEnum = z.enum(actions);

export const modules = [
    "dashboard",
    "owners",
    "tenants",
    "buildings",
    "units",
    "rentals",
    "reservations",
    "propertyManagement",
    "invoicing",
    "contracts",
    "quotes",
    "checkInOutReports",
    "accounting",
    "appointments",
    "serviceProviders",
    "communication",
    "settings",
] as const;


export type ModuleType = (typeof modules)[number];

export const moduleFr: Record<ModuleType, string> = {
    dashboard: "Tableau de bord",
    owners: "Propriétaires",
    tenants: "Locataires",
    buildings: "Immeubles",
    units: "Unités",
    rentals: "Locations",
    reservations: "Réservations",
    propertyManagement: "Gestion immobilière",
    invoicing: "Facturation",
    contracts: "Contrats",
    quotes: "Devis",
    checkInOutReports: "Rapports entrée/sortie",
    accounting: "Comptabilité",
    appointments: "Rendez-vous",
    serviceProviders: "Prestataires",
    communication: "Communication",
    settings: "Paramètres",
};

export const actionLabels: Record<string, string> = {
    read: "Lire",
    create: "Créer",
    update: "Modifier",
};

type PermissionsShape = {
    [K in ModuleType]: z.ZodArray<typeof actionEnum>;
};

const permissionsShape: PermissionsShape = modules.reduce(
    (acc, module) => {
        acc[module] = z.array(actionEnum);
        return acc;
    },
    {} as PermissionsShape
);

export const permissionsSchema = z.object(permissionsShape);

export type PermissionsSchemaType = z.infer<typeof permissionsSchema>;