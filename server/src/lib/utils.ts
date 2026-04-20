import { Rental, Unit } from "../generated/prisma/client";
import { getSignedFileUrl } from "./storage";

export function hasOverdueRentals(rentals: Rental[]): boolean {
    const now = new Date();

    return rentals.some(rental => {
        return new Date(rental.end) < now;
    });
}

export async function safeSignedUrls(keys?: string | string[]) {
    if (!keys) {
        return { urls: [], error: false };
    }

    const isSingle = typeof keys === "string";
    const normalizedKeys = isSingle ? [keys] : keys;

    const results = await Promise.allSettled(
        normalizedKeys.map((key) => getSignedFileUrl(key))
    );

    const urls = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
        .map((r) => r.value);

    const error = results.some((r) => r.status === "rejected");

    return {
        urls: isSingle ? urls[0] ?? null : urls,
        error,
    };
}

export function generateRef(ref?: string, position: number = 1): string {
    const prefix = ref && ref.trim() !== "" ? ref.toUpperCase() : "REF";

    const formattedNumber = position
        .toString()
        .padStart(3, "0");

    return `${prefix}-${formattedNumber}`;
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