import { BoxIcon, BuildingIcon, CalculatorIcon, CalendarCheck2Icon, CalendarDaysIcon, ClipboardListIcon, CogIcon, FileCheckCornerIcon, FilePenIcon, KeySquareIcon, Layers2Icon, LayoutDashboardIcon, ListCheckIcon, MessagesSquareIcon, ReceiptTextIcon, SquareKanbanIcon, UserCheck2Icon, UserKeyIcon, UserLockIcon } from "lucide-react";

export const sidebar = [
    {
        id: 1,
        icon: LayoutDashboardIcon,
        title: "Tableau de bord",
        path: "/dashboard",
        exact: true,
    },
    {
        id: 2,
        icon: UserLockIcon,
        title: "Propriétaires",
        path: "/dashboard/owners/"
    },
    {
        id: 3,
        icon: UserKeyIcon,
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
        icon: Layers2Icon,
        title: "Unités",
        path: "/dashboard/units"
    },
    {
        id: 6,
        icon: KeySquareIcon,
        title: "Locations",
        path: "/dashboard/rentals"
    },
    {
        id: 7,
        icon: CalendarDaysIcon,
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
        icon: ClipboardListIcon,
        title: "Bons de commande",
        path: "/dashboard/purchase-orders"
    },
    {
        id: 13,
        icon: FilePenIcon,
        title: "Contrats",
        path: "/dashboard/contracts"
    },
    {
        id: 14,
        icon: ListCheckIcon,
        title: "État des lieux",
        path: "/dashboard/reports"
    },
    {
        id: 15,
        icon: CalculatorIcon,
        title: "Comptabilité",
        path: "/dashboard/accounting"
    },
    {
        id: 16,
        icon: CalendarCheck2Icon,
        title: "Rendez-vous",
        path: "/dashboard/appointments"
    },
    {
        id: 17,
        icon: UserCheck2Icon,
        title: "Prestataires de services",
        path: "/dashboard/service-providers"
    },
    {
        id: 18,
        icon: MessagesSquareIcon,
        title: "Communication",
        path: "/dashboard/communications"
    },
    {
        id: 19,
        icon: CogIcon,
        title: "Paramètres",
        path: "/dashboard/settings"
    },

]