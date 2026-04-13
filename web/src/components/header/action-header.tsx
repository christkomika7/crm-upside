import React, { Activity } from "react"
import {
    Breadcrumb,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Link, useLocation, useRouter } from "@tanstack/react-router"
import { breadcrumbs, type BreadcrumbKey } from "@/lib/breadcrumbs"

type ActionHeaderProps = {
    title?: string;
    url?: string;
    hasIcon?: boolean;
    type?: "url" | "modal";
    component?: React.ReactNode;
    secondComponent?: React.ReactNode;
    showAction?: boolean;
    showSecond?: boolean;
    showComponent?: boolean;
}

const SKIP_SEGMENTS = new Set([
    "edit-tenant", "view-tenant",
    "edit-owner", "view-owner",
    "edit-building", "view-building",
    "edit-unit", "view-unit",
    "edit-rental", "view-rental",
    "edit-reservation", "view-reservation",
    "edit-property", "view-property",
    "edit-product-service", "view-product-service",
    "edit-invoice", "view-invoice",
    "edit-quote", "view-quote",
    "edit-purchase-order", "view-purchase-order",
    "edit-contract", "view-contract",
    "edit-report", "view-report",
    "edit-accounting", "view-accounting",
    "edit-appointment", "view-appointment",
    "edit-service", "view-service",
    "edit-communication", "view-communication",
])

export default function ActionHeader({
    title,
    url,
    type,
    component,
    secondComponent,
    hasIcon = true,
    showAction = true,
    showSecond = true,
    showComponent = true
}: ActionHeaderProps) {
    const router = useRouter()
    const location = useLocation()

    const elements = location.pathname.split("/").filter(Boolean)
    const segments = elements.slice(1)

    const crumbs: { label: string; href: string }[] = []

    for (const seg of segments) {
        const segIndex = elements.lastIndexOf(seg)
        const fullPath = "/" + elements.slice(0, segIndex + 1).join("/")

        if (SKIP_SEGMENTS.has(seg)) continue
        if (seg.includes("_") && seg.includes("-")) {
            const prefix = seg.substring(0, seg.indexOf("-"))
            if (prefix in breadcrumbs) {
                crumbs.push({ label: breadcrumbs[prefix as BreadcrumbKey], href: fullPath })
            }
            continue
        }

        const label = seg in breadcrumbs ? breadcrumbs[seg as BreadcrumbKey] : seg
        crumbs.push({ label, href: fullPath })
    }

    const isDeep = crumbs.length > 1

    return (
        <div className="flex items-center justify-between px-1 py-2">
            <div className="flex items-center gap-2">
                {isDeep && (
                    <>
                        <Button
                            variant="back"
                            size="sm"
                            onClick={() => router.history.back()}
                            className="gap-1.5 text-muted-foreground text-xs"
                        >
                            <ArrowLeftIcon className="size-3.5" />
                            Retour
                        </Button>
                        <span className="text-neutral-300 ml-1">|</span>
                    </>
                )}

                <Breadcrumb>
                    <BreadcrumbList>
                        {crumbs.map((crumb, index) => {
                            const isFirst = index === 0
                            const isLast = index === crumbs.length - 1
                            const hasMultiple = crumbs.length > 1

                            return (
                                <React.Fragment key={index}>
                                    {isLast ? (
                                        <BreadcrumbPage
                                            className={[
                                                "text-sm",
                                                hasMultiple ? "text-muted-foreground" : "",
                                                isFirst ? "text-xl font-bold" : "",
                                            ].join(" ")}
                                        >
                                            {crumb.label}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink
                                            href={crumb.href}
                                            className={[
                                                "text-sm",
                                                isFirst ? "text-xl text-neutral-800 font-bold" : "text-neutral-500",
                                            ].join(" ")}
                                        >
                                            {crumb.label}
                                        </BreadcrumbLink>
                                    )}

                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <Activity mode={showSecond ? "visible" : "hidden"}>
                        {secondComponent}
                    </Activity>

                    <Activity mode={showAction ? "visible" : "hidden"}>
                        <>
                            {type === "url" && url && title && (
                                <Link to={url}>
                                    <Button variant="action" size="sm" className="gap-1.5 border-0!">
                                        {hasIcon && <PlusIcon className="size-4" />}
                                        {title}
                                    </Button>
                                </Link>
                            )}
                        </>
                    </Activity>

                    <Activity mode={showComponent ? "visible" : "hidden"}>
                        {component}
                    </Activity>
                </div>
            </div>
        </div>
    )
}