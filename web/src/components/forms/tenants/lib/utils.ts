import type { TenantSchemaType } from "@/lib/zod/tenants";

export const DEFAULT_VALUES: TenantSchemaType = {
    isPersonal: true,
    isDiplomatic: false,
    firstname: "",
    lastname: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    maritalStatus: "",
    income: "",
    paymentMode: [],
    bankInfo: "",
    documents: undefined,
}
