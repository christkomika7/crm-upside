import { canAccess } from '@/lib/permission'
import { moduleFr, modules, type ModuleType } from '@/lib/zod/permissions'
import { Route } from '@/routes'
import type { User } from '@/types/user'
import { Link } from '@tanstack/react-router'
import { Home, ArrowLeft, ShieldOff } from 'lucide-react'

export const MODULE_ROUTES: Record<ModuleType, string> = {
    dashboard: '/dashboard',
    owners: '/dashboard/owners',
    tenants: '/dashboard/tenants',
    buildings: '/dashboard/buildings',
    units: '/dashboard/units',
    rentals: '/dashboard/rentals',
    reservations: '/dashboard/reservations',
    propertyManagement: '/dashboard/property-management',
    productService: '/dashboard/product-service',
    invoicing: '/dashboard/invoices',
    purchaseOrders: '/dashboard/purchase-orders',
    contracts: '/dashboard/contracts',
    quotes: '/dashboard/quotes',
    checkInOutReports: '/dashboard/reports',
    accounting: '/dashboard/accounting',
    appointments: '/dashboard/appointments',
    serviceProviders: '/dashboard/service-providers',
    communication: '/dashboard/communications',
    settings: '/dashboard/settings',
}


export default function NotFound() {
    const { session } = Route.useRouteContext();
    const permission = (session.data?.user as unknown as User).permission?.permissions;

    const accessibleModules = modules.filter(
        (mod) => canAccess(permission, mod, ['read'])
    )

    const hasAnyAccess = accessibleModules.length > 0

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
            <div className="mb-8 text-center">
                <p className="text-8xl font-light tracking-tight text-neutral-200 select-none">
                    404
                </p>
                <h1 className="mt-2 text-xl font-medium text-neutral-800">
                    Page introuvable
                </h1>
                <p className="mt-2 text-sm text-neutral-400 max-w-xs mx-auto">
                    Cette page n'existe pas ou vous n'avez pas les droits pour y accéder.
                </p>
            </div>

            {hasAnyAccess ? (
                <div className="w-full max-w-md">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3 text-center">
                        Pages disponibles
                    </p>
                    <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
                        {accessibleModules.map((mod, index) => (
                            <Link
                                key={mod}
                                to={MODULE_ROUTES[mod]}
                                className={[
                                    "flex items-center justify-between px-5 py-3.5",
                                    "text-sm text-neutral-700 hover:bg-neutral-50",
                                    "transition-colors group",
                                    index !== accessibleModules.length - 1
                                        ? "border-b border-neutral-50"
                                        : "",
                                ].join(" ")}
                            >
                                <span className="group-hover:text-neutral-900 transition-colors">
                                    {moduleFr[mod]}
                                </span>
                                <ArrowLeft className="size-3.5 text-neutral-300 rotate-180 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-neutral-100 rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                        <ShieldOff className="size-4 text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-neutral-700">
                        Accès restreint
                    </p>
                    <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                        Votre compte n'a accès à aucune section de l'application.
                        Contactez votre administrateur.
                    </p>
                </div>
            )}

            {canAccess(permission, 'dashboard', ['read']) && (
                <Link
                    to="/dashboard"
                    className="mt-6 flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    <Home className="size-3.5" />
                    Retour à l'accueil
                </Link>
            )}
        </div>
    )
}