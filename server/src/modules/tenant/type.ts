import { t } from "elysia";


export default {
    body: t.Object({
        firstname: t.String(),
        lastname: t.String(),
        company: t.String(),
        phone: t.String(),
        email: t.String(),
        address: t.String(),
        income: t.String(),
        maritalStatus: t.String(),
        bankInfo: t.String(),
        paymentMode: t.String(),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String() })
} 