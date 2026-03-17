import { t } from "elysia";


export default {
    body: t.Object({
        buildings: t.Transform(t.String())
            .Decode((value) => JSON.parse(value) as string[])
            .Encode((value) => JSON.stringify(value)),
        firstname: t.String(),
        lastname: t.String(),
        company: t.String(),
        phone: t.String(),
        email: t.String(),
        address: t.String(),
        actionnary: t.String(),
        bankInfo: t.String(),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String() })
} 