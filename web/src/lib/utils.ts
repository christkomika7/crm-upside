import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { STATUS_COLORS } from "./constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(value: string) {
  return value
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const pluralize = (count: number, singular: string, plural: string) =>
  count > 1 ? plural : singular;

export function cutText(name: string, limit?: number, hasPoint = true) {
  const point = hasPoint ? "..." : "";
  if (name.length > (limit || 15)) {
    return name.slice(0, limit || 15) + point;
  }
  return name;
}


export function formatNumber(value?: string | number): string {
  if (value === undefined || value === null) return "";

  const str = value.toString().replace(/\s+/g, "");

  if (!/^-?\d+(\.\d+)?$/.test(str)) {
    throw new Error(
      "La valeur doit être un nombre valide (entier, décimal ou négatif)",
    );
  }

  const isNegative = str.startsWith("-");
  const absStr = isNegative ? str.slice(1) : str;

  const [integerPart, decimalPart] = absStr.split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const formattedNumber = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  return isNegative ? `-${formattedNumber}` : formattedNumber;
}

export function formatDateTo(date: Date, model: "dash" | "slash" = "slash"): string {
  switch (model) {
    case "dash":
      return new Date(date).toLocaleDateString().replaceAll("/", "-");
    case "slash":
      return new Date(date).toLocaleDateString();
  }
}

export function getColor(index: number): string {
  return STATUS_COLORS[index % STATUS_COLORS.length];
}