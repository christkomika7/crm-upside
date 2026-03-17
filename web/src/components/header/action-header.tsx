import React from "react"
import {
    Breadcrumb,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Activity } from "react"
import { Link, useLocation, useRouter } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { breadcrumbs, type BreadcrumbKey } from "@/lib/breadcrumbs"

type ActionHeaderProps = {
    title?: string;
    url?: string;
    hasIcon?: boolean;
    type?: "url" | "modal";
    component?: React.ReactNode;
    secondComponnet?: React.ReactNode;

}

export default function ActionHeader({ title, url, type, component, secondComponnet, hasIcon = true }: ActionHeaderProps) {
    const router = useRouter()
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean).slice(1);
    const elements = location.pathname.split("/").filter(Boolean);

    switch (type) {
        case "url":
            if (!url || !title) {
                throw new Error("Le lien et le titre sont requis au niveau du ActionHeader");
            }
            break;
        case "modal":
            if (!component) {
                throw new Error("Le composant est requis au niveau du ActionHeader");
            }
    }


    function getPathname(value: string) {
        let current: string = '';
        let urls: string[] = [];
        for (const element of elements) {
            current = element;
            urls = [...urls, element]
            if (current === value) {
                break;
            }
        }
        return `/${urls.join("/")}`;
    }

    function getTitle(value: string) {
        const path = value.split("-")[0];
        const isExist = path in breadcrumbs;
        return isExist ? breadcrumbs[path as BreadcrumbKey] : breadcrumbs[value as BreadcrumbKey];
    }

    return (
        <div className="grid grid-cols-2">
            <div className="flex items-center gap-x-4">
                <Activity mode={paths.length > 1 ? "visible" : "hidden"}>
                    <Button variant="outline" onClick={() => router.history.back()}>
                        <ArrowLeftIcon />
                        Back
                    </Button>
                </Activity>
                <Breadcrumb>
                    <BreadcrumbList>
                        {paths.map((path, index) => (
                            <React.Fragment key={index}>
                                <Activity mode={index + 1 === paths.length ? "hidden" : "visible"}>
                                    <BreadcrumbLink href={getPathname(path)} className={cn('text-base',)}>{getTitle(path)}</BreadcrumbLink>
                                </Activity>
                                {/* Last */}
                                <Activity mode={index + 1 === paths.length ? "visible" : "hidden"}>

                                    <BreadcrumbPage className={cn('text-lg font-semibold',)}>{getTitle(path)}</BreadcrumbPage>
                                </Activity>
                                <Activity mode={index + 1 === paths.length ? "hidden" : "visible"}>
                                    <BreadcrumbSeparator />
                                </Activity>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center justify-end gap-x-4">
                {secondComponnet}
                <Activity mode={type === "url" && title && url ? "visible" : "hidden"}>
                    <Link to={url}>
                        <Button variant="action" className="w-fit"> {hasIcon && <PlusIcon className="size-3.5" />} {title}</Button>
                    </Link>
                </Activity>
                <Activity mode={type === "modal" && component ? "visible" : "hidden"}>
                    {component}
                </Activity>
            </div>
        </div>
    )
}
