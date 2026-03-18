import { Unit } from "../generated/prisma/client";
import { getSignedFileUrl } from "./storage";

export async function safeSignedUrls(keys?: string[]) {
    if (!keys?.length) {
        return { urls: [], error: false };
    }

    const results = await Promise.allSettled(
        keys.map((key) => getSignedFileUrl(key))
    );

    const urls = results
        .filter((r) => r.status === "fulfilled")
        .map((r: any) => r.value);

    const error = results.some((r) => r.status === "rejected");

    return { urls, error };
}

export function getUnitAmenities(unit: Unit): string {
    const amenities: string[] = [];
    const furnished = unit.furnished === "furnished" ? "Meublé" : unit.furnished === "semi-furnished" ? "Semi-meublé" : "Non meublé";

    if (unit.wifi) amenities.push("Wifi");
    if (unit.water) amenities.push("Eau");
    if (unit.electricity) amenities.push("Électricité");
    if (unit.tv) amenities.push("Télévision");

    return [furnished, ...amenities].join(", ");
}


export function formatDateToString(date: Date) {
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}


export function duration(start: Date, end: Date): string {
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} mois`);
    if (days > 0) parts.push(`${days} jour${days > 1 ? "s" : ""}`);

    return parts.join(" & ") || "0 jour";
}