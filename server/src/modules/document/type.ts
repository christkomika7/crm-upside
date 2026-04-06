import { t } from "elysia";

export default {
    body: t.Object({
        id: t.String({ error: "L'identifiant est requis" }),
        type: t.Enum({
            INVOICE: "INVOICE",
            QUOTE: "QUOTE",
        }, { error: "Le type de document est requis." }),
        emails: t.Transform((t.String()))
            .Decode((value) => JSON.parse(value) as string[])
            .Encode((value) => JSON.stringify(value)),
        subject: t.Optional(t.String()),
        message: t.Optional(t.String()),
        document: t.File({ error: "Le document est requis" }),
        files: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    query: t.Object({
        type: t.Enum({
            PAID: "INVOICE",
            UNPAID: "QUOTE",
        }, { error: "Le type de document est requis." })
    }),
    param: t.Object({
        id: t.String({ error: "L'identifiant est requis" })
    }),

}