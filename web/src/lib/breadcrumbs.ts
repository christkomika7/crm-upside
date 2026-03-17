export type BreadcrumbKey =
    "owners" | "new-owner" | "edit_owner" | "view_owner" |
    "tenants" | "new-tenant" | "edit_tenant" | "view_tenant" |
    "buildings" | "new-building" | "edit_building" | "view_building" |
    "units" | "new-unit" | "edit_unit" | "view_unit" |
    "rentals" | "new-rental" | "edit_rental" | "view_rental" |
    "reservations" | "new-reservation" | "edit_reservation" | "view_reservation" |
    "property-management" | "new-property" | "edit_property" | "view_property" |
    "invoices" | "new-invoice" | "edit_invoice" | "view_invoice" |
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
    'new-owner': 'Nouveau propriétaire',
    'edit_owner': "Modification propriétaire",
    'view_owner': "Gestion immobilière",

    //  Tenants
    'tenants': "Locataire",
    'new-tenant': "Nouveau locataire",
    'edit_tenant': "Modification locataire",
    'view_tenant': "Profil du locataire",

    // Buildings
    'buildings': "Bâtiment",
    'new-building': "Nouveau bâtiment",
    'edit_building': "Modification bâtiment",
    'view_building': "Profil du bâtiment",


    // Buildings
    'units': "Unité",
    'new-unit': "Nouvel unité",
    'edit_unit': "Modification unité",
    'view_unit': "Profil de l'unité",

    // Rentals
    'rentals': "Loyer",
    'new-rental': "Nouveau loyer",
    'edit_rental': "Modification du loyer",
    'view_rental': "Profil du loyer",

    // Reservations
    'reservations': "Reservation",
    'new-reservation': "Nouvelle reservation",
    'edit_reservation': "Modification de la reservation",
    'view_reservation': "Profil de la reservation",

    // Property Management
    'property-management': "Gestion des biens",
    'new-property': "Nouveau bien",
    'edit_property': "Modification du bien",
    'view_property': "Profil du bien",

    // Invoices
    'invoices': "Gestion des factures",
    'new-invoice': "Nouvelle facture",
    'edit_invoice': "Modification de la facture",
    'view_invoice': "Information sur la facture",

    // Contracts
    'contracts': "Contracts/Mandates",
    'new-contract': "Nouveau contrat",
    'edit_contract': "Modification du contrat",
    'view_contract': "Information du contrat",

    // Reports
    'reports': "Point de suivi & Nos rapports",
    'new-report': "Nouveau point de suivi & rapports",
    'edit_report': "Modification du point de suivi & rapports",
    'view_report': "Information sur le point de suivi & rapports",

    // Accounting
    'accounting': "Comptabilité",
    'new-accounting': "Nouvelle comptabilité",
    'edit_accounting': "Modification de la comptabilité",
    'view_accounting': "Information sur la comptabilité",

    // Appointments
    'appointments': "Rendez-vous",
    'new-appointment': "Nouveau rendez-vous",
    'edit_appointment': "Modification du rendez-vous",
    'view_appointment': "Information sur le rendez-vous",

    // Service Providers
    'service-providers': "Fournisseurs de services",
    'new-service': "Nouveau fournisseur de services",
    'edit_service': "Modification du fournisseur de services",
    'view_service': "Information sur le fournisseur de services",

    // Communications
    'communications': "Communications",
    'new-communication': "Nouvelle communication",
    'edit_communication': "Modification de la communication",
    'view_communication': "Information sur la communication",

    // Settings
    'settings': "Paramètres",
}
