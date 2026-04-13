import { sidebar } from "@/lib/navigation"
import { Button } from "../../../components/ui/button"
import { LogOutIcon, PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react"
import Logo from "../../../assets/emerald-logo.png"
import { Link, useRouter, useRouteContext } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/auth-client"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { User } from "@/types/user"
import { canAccess } from "@/lib/permission"
import type { ModuleType } from "@/lib/zod/permissions"

const PATH_TO_MODULE: Record<string, ModuleType> = {
    "/dashboard": "dashboard",
    "/dashboard/owners/": "owners",
    "/dashboard/tenants": "tenants",
    "/dashboard/buildings": "buildings",
    "/dashboard/units": "units",
    "/dashboard/rentals": "rentals",
    "/dashboard/reservations": "reservations",
    "/dashboard/property-management": "propertyManagement",
    "/dashboard/product-service": "productService",
    "/dashboard/invoices": "invoicing",
    "/dashboard/quotes": "quotes",
    "/dashboard/purchase-orders": "purchaseOrders",
    "/dashboard/contracts": "contracts",
    "/dashboard/reports": "checkInOutReports",
    "/dashboard/accounting": "accounting",
    "/dashboard/appointments": "appointments",
    "/dashboard/service-providers": "serviceProviders",
    "/dashboard/communications": "communication",
    "/dashboard/settings": "settings",
}

type SidebarProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const { session } = useRouteContext({ from: "__root__" });

    const permission = (session?.data?.user as unknown as User)?.permission?.permissions;

    const visibleItems = sidebar.filter((item) => {
        const mod = PATH_TO_MODULE[item.path];
        if (!mod) return false;
        return canAccess(permission, mod, ["read"]);
    });

    async function handleLogout() {
        setIsPending(true);
        await authClient.signOut();
        await router.invalidate();
        await router.navigate({ to: "/" });
        setIsPending(false);
    }

    return (
        <div className="bg-white h-full w-full shadow-xl flex flex-col transition-all duration-300">
            <div className="flex items-center justify-between">
                <Link to="/dashboard">
                    <div
                        className="w-18 flex items-center"
                        style={{ paddingInline: open ? "1rem" : "0" }}
                    >
                        <span className="h-15 w-18 flex justify-center items-center">
                            <img src={Logo} alt="Logo" className="size-12 object-contain object-center shrink-0" />
                        </span>
                        {open && (
                            <h1 className="font-extrabold relative left-1 text-xl text-emerald-dark uppercase">
                                UPSIDE
                            </h1>
                        )}
                    </div>
                </Link>

                <span
                    className="text-neutral-600 cursor-pointer p-2 relative"
                    style={{ top: 2, left: open ? 0 : 1 }}
                    onClick={() => setOpen(!open)}
                >
                    {!open ? (
                        <PanelLeftCloseIcon className="size-4.5" />
                    ) : (
                        <PanelRightCloseIcon className="size-4.5" />
                    )}
                </span>
            </div>

            <div className="flex-1 overflow-hidden px-2 py-4">
                <ScrollArea className="h-full pl-3" dir="rtl">
                    <ul className="space-y-1" dir="ltr">
                        {visibleItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.path}
                                    activeOptions={{ exact: item.exact }}
                                    activeProps={{
                                        className: "bg-emerald-background text-white",
                                    }}
                                    inactiveProps={{
                                        className: "text-neutral-600 hover:bg-emerald-50 hover:text-emerald-dark",
                                    }}
                                    className={`flex items-center rounded-md text-sm transition-all duration-200
                                        ${open ? "px-3 py-2" : "justify-center py-3"}
                                    `}
                                >
                                    <item.icon className="size-5 shrink-0" />
                                    {open && (
                                        <span className="ml-3 whitespace-nowrap">
                                            {item.title}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ScrollBar />
                </ScrollArea>
            </div>

            <div className="h-14 px-2 mb-4 flex items-center">
                <Button
                    onClick={handleLogout}
                    disabled={isPending}
                    variant="logout"
                    className={`w-full flex items-center gap-2 ${open ? "" : "px-0"}`}
                >
                    {isPending ? <Spinner /> : <LogOutIcon className="size-4" />}
                    {open && <span>Déconnexion</span>}
                </Button>
            </div>
        </div>
    );
}