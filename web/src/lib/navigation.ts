import { BoxIcon, BuildingIcon, CalculatorIcon, CalendarCheck2Icon, CogIcon, FileCheckCornerIcon, FilePenIcon, HandPlatterIcon, KeySquareIcon, LayoutDashboardIcon, ListCheckIcon, MessagesSquareIcon, PencilRulerIcon, ReceiptTextIcon, SquareKanbanIcon, UserLockIcon, UsersIcon } from "lucide-react";

export const sidebar = [
    {
        id: 1,
        icon: LayoutDashboardIcon,
        title: "Tableau de bord",
        path: "/dashboard"
    },
    {
        id: 2,
        icon: UsersIcon,
        title: "Propriétaires",
        path: "/dashboard/owners/"
    },
    {
        id: 3,
        icon: UserLockIcon,
        title: "Locataires",
        path: "/dashboard/tenants"
    },
    {
        id: 4,
        icon: BuildingIcon,
        title: "Bâtiments",
        path: "/dashboard/buildings"
    },
    {
        id: 5,
        icon: PencilRulerIcon,
        title: "Unités",
        path: "/dashboard/units"
    },
    {
        id: 6,
        icon: KeySquareIcon,
        title: "Loyers",
        path: "/dashboard/rentals"
    },
    {
        id: 7,
        icon: FileCheckCornerIcon,
        title: "Réservations",
        path: "/dashboard/reservations"
    },
    {
        id: 8,
        icon: SquareKanbanIcon,
        title: "Gestion des biens",
        path: "/dashboard/property-management"
    },
    {
        id: 9,
        icon: BoxIcon,
        title: "Produits | Services",
        path: "/dashboard/product-service"
    },
    {
        id: 10,
        icon: ReceiptTextIcon,
        title: "Facturation",
        path: "/dashboard/invoices"
    },
    {
        id: 11,
        icon: FileCheckCornerIcon,
        title: "Devis",
        path: "/dashboard/quotes"
    },
    {
        id: 12,
        icon: FilePenIcon,
        title: "Contrats",
        path: "/dashboard/contracts"
    },
    {
        id: 13,
        icon: ListCheckIcon,
        title: "Mouvements",
        path: "/dashboard/reports"
    },
    {
        id: 14,
        icon: CalculatorIcon,
        title: "Comptabilité",
        path: "/dashboard/accounting"
    },
    {
        id: 15,
        icon: CalendarCheck2Icon,
        title: "Rendez-vous",
        path: "/dashboard/appointments"
    },
    {
        id: 16,
        icon: HandPlatterIcon,
        title: "Prestataires de services",
        path: "/dashboard/service-providers"
    },
    {
        id: 17,
        icon: MessagesSquareIcon,
        title: "Communication",
        path: "/dashboard/communications"
    },
    {
        id: 18,
        icon: CogIcon,
        title: "Paramètres",
        path: "/dashboard/settings"
    },

]