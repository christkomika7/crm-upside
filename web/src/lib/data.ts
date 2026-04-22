import type { CardBalanceProps } from "@/components/card/card-balance";
import type { DeletionKey } from "@/types/deletion";


export const dueDates = [
    { value: "30", label: "30 jours" },
    { value: "60", label: "60 jours" },
    { value: "90", label: "90 jours" },
    { value: "120", label: "120 jours" },
    { value: "150", label: "150 jours" },
    { value: "180", label: "180 jours" },
    { value: "210", label: "210 jours" },
    { value: "240", label: "240 jours" },
    { value: "270", label: "270 jours" },
    { value: "300", label: "300 jours" },
    { value: "330", label: "330 jours" },
    { value: "360", label: "360 jours" },
]

export const balances: CardBalanceProps[] = [
    {
        id: 'bcdodnd',
        icon: "cash",
        value: "$27000",
        title: "Cash Balance",
    },
    {
        id: 'ediowdjn',
        icon: "bank",
        value: "$27000",
        title: "Bank 2",
    },
    {
        id: 'nsodnsscdso',
        icon: "bank",
        value: "$27000",
        title: "Bank 3",
    },
    {
        id: 'endosjdnsd',
        icon: "bank",
        value: "$27000",
        title: "Bank 4",
    },

]

export const reveivables: CardBalanceProps[] = [
    {
        id: 'bibjmk',
        hasIcon: false,
        value: '$16000',
        title: "Supplier Debts",
    },
    {
        id: 'ijnjno',
        hasIcon: false,
        value: '$16000',
        title: "Supplier Debts",
    },
    {
        id: 'binijnln',
        hasIcon: false,
        value: '$16000',
        title: "Supplier Debts",
    },
    {
        id: 'jihjhj',
        hasIcon: false,
        value: '$16000',
        title: "Supplier Debts",
    },
    {
        id: 'iuhjnoi',
        hasIcon: false,
        value: ['$16000', '$17000'],
        title: "Supplier Debts",
    },
    {
        id: 'ygiuhoij',
        hasIcon: false,
        value: '$16000',
        title: "Supplier Debts",
    },

]

export const buildingManagementStatus = [
    { value: "locative", label: "Gestion locative" },
    { value: "technique", label: "Gestion technique" },
    { value: "administrative", label: "Gestion administrative" },
]

export const furnishedOptions = [
    { value: "furnished", label: "Meublé" },
    { value: "semi-furnished", label: "Semi-meublé" },
    { value: "unfurnished", label: "Non meublé" },
]

export const paymentMode = [
    { value: "CASH", label: "Espèces" },
    { value: "CHECK", label: "Chèque" },
    { value: "BANK", label: "Virement" },
]


export const deletionLabels: Record<DeletionKey, string> = {
    OWNER: "Propriétaire",
    BUILDING: "Bâtiment",
    TENANT: "Locataire",
    UNIT: "Unité",
    RENTAL: "Location",
    RESERVATION: "Réservation",
    PROPERTY_MANAGEMENT: "Gestion immobilière",
    PRODUCT_SERVICE: "Produit | Service",
    INVOICING: "Facturation",
    PURCHASE_ORDER: "Bon de commande",
    QUOTE: "Devis",
    CONTRACT: "Contrat",
    CHECK_IN: "État de lieu",
    APPOINTMENT: "Rendez-vous",
    SERVICE_PROVIDER: "Prestataire",
    COMMUNICATION: "Communication",
}