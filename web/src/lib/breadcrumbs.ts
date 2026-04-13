export type BreadcrumbKey =
    "owners" | "new-owner" | "edit_owner" | "view_owner" |
    "tenants" | "new-tenant" | "edit_tenant" | "view_tenant" |
    "buildings" | "new-building" | "edit_building" | "view_building" |
    "units" | "new-unit" | "edit_unit" | "view_unit" |
    "rentals" | "new-rental" | "edit_rental" | "view_rental" |
    "reservations" | "new-reservation" | "edit_reservation" | "view_reservation" |
    "property-management" | "new-property" | "edit_property" | "view_property" |
    "product-service" | "new-product-service" | "edit_product-service" | "view_product-service" |
    "invoices" | "new-invoice" | "edit_invoice" | "view_invoice" |
    "quotes" | "new-quote" | "edit_quote" | "view_quote" |
    "purchase-orders" | "new-purchase-order" | "edit_purchase-order" | "view_purchase-order" |
    "contracts" | "new-contract" | "edit_contract" | "view_contract" |
    "reports" | "new-report" | "edit_report" | "view_report" |
    "accounting" | "new-accounting" | "edit_accounting" | "view_accounting" |
    "appointments" | "new-appointment" | "edit_appointment" | "view_appointment" |
    "service-providers" | "new-service" | "edit_service" | "view_service" |
    "communications" | "new-communication" | "edit_communication" | "view_communication" |
    "settings";




export const breadcrumbs: Record<BreadcrumbKey, string> = {
    // Owners
    'owners': "Propriétaires",
    'new-owner': 'Nouveau',
    'edit_owner': "Modification",
    'view_owner': "Aperçu",

    //  Tenants
    'tenants': "Locataire",
    'new-tenant': "Nouveau",
    'edit_tenant': "Modification",
    'view_tenant': "Aperçu",

    // Buildings
    'buildings': "Bâtiment",
    'new-building': "Nouveau",
    'edit_building': "Modification",
    'view_building': "Aperçu",


    // Buildings
    'units': "Unité",
    'new-unit': "Nouveau",
    'edit_unit': "Modification",
    'view_unit': "Aperçu",

    // Rentals
    'rentals': "Loyer",
    'new-rental': "Nouveau",
    'edit_rental': "Modification",
    'view_rental': "Aperçu",

    // Reservations
    'reservations': "Reservation",
    'new-reservation': "Nouvelle",
    'edit_reservation': "Modification",
    'view_reservation': "Aperçu",

    // Property Management
    'property-management': "Gestion des biens",
    'new-property': "Nouveau",
    'edit_property': "Modification",
    'view_property': "Aperçu",

    // Product | Service
    'product-service': "Gestion des produits | services",
    'new-product-service': "Nouveau",
    'edit_product-service': "Modification",
    'view_product-service': "Aperçu",

    // Invoices
    'invoices': "Gestion des factures",
    'new-invoice': "Nouvelle",
    'edit_invoice': "Modification",
    'view_invoice': "Aperçu",

    // Quotes
    'quotes': "Gestion des devis",
    'new-quote': "Nouveau",
    'edit_quote': "Modification",
    'view_quote': "Aperçu",

    // Purchase Orders
    'purchase-orders': "Gestion des Bon de commande",
    'new-purchase-order': "Nouveau",
    'edit_purchase-order': "Modification",
    'view_purchase-order': "Aperçu",


    // Contracts
    'contracts': "Contracts/Mandates",
    'new-contract': "Nouveau",
    'edit_contract': "Modification",
    'view_contract': "Aperçu",

    // Reports
    'reports': "État des lieux",
    'new-report': "Nouveau",
    'edit_report': "Modification",
    'view_report': "Aperçu",

    // Accounting
    'accounting': "Comptabilité",
    'new-accounting': "Nouveau",
    'edit_accounting': "Modification",
    'view_accounting': "Aperçu",

    // Appointments
    'appointments': "Rendez-vous",
    'new-appointment': "Nouveau",
    'edit_appointment': "Modification",
    'view_appointment': "Aperçu",

    // Service Providers
    'service-providers': "Fournisseurs de services",
    'new-service': "Nouveau",
    'edit_service': "Modification",
    'view_service': "Aperçu",

    // Communications
    'communications': "Communications",
    'new-communication': "Nouvelle",
    'edit_communication': "Modification",
    'view_communication': "Aperçu",

    // Settings
    'settings': "Paramètres",
}
