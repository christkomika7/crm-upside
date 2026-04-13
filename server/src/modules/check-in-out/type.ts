import { t } from "elysia";

export default {
    body: t.Object({
        tenant: t.String({ error: "Le locataire est requis." }),
        unit: t.String({ error: "L'unité est requise." }),
        date: t.Transform(t.String({ error: "La date est requise." }))
            .Decode(value => new Date(value))
            .Encode(value => value.toISOString()),
        note: t.Optional(t.String()),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    queryType: t.Object({
        type: t.Enum({
            CHECK_IN: "CHECK_IN",
            CHECK_OUT: "CHECK_OUT",
            ALL: "ALL"
        }, { error: "Le type d’état des lieux est requis." })
    }),
    queryDocument: t.Object({
        type: t.Enum({
            PDF: "PDF",
            DOCX: "DOCX",
        }, { error: "Le type de document est requis." })
    }),
    paramsId: t.Object({
        id: t.String({ error: "L'identifiant est requis." })
    }),
    mailBody: t.Object({
        id: t.String({ error: "L'identifiant est requis" }),
        emails: t.Transform((t.String()))
            .Decode((value) => JSON.parse(value) as string[])
            .Encode((value) => JSON.stringify(value)),
        subject: t.Optional(t.String()),
        message: t.Optional(t.String()),
        files: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    })
}