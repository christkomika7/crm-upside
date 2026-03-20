import type { CardBalanceProps } from "@/components/card/card-balance";
import type { DeletionKey, DeletionType } from "@/types/deletion";

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
    { value: "cash", label: "Espèces" },
    { value: "cheque", label: "Chèque" },
    { value: "virement", label: "Virement" },
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
    QUOTE: "Devis",
    CONTRACT: "Contrat",
    CHECK_IN: "Check-in",
    APPOINTMENT: "Rendez-vous",
    SERVICE_PROVIDER: "Prestataire",
    COMMUNICATION: "Communication",
}