import { t } from "elysia";

export default {
    queryType: t.Object({
        type: t.Enum({
            WAIT: "WAIT",
            ARCHIVED: "ARCHIVED",
            ALL: "ALL"
        }, { error: "Le type de contrat est requis." })
    }),
    queryAction: t.Object({
        type: t.Enum({
            CONTRACT: "CONTRACT",
            MANDATE: "MANDATE",
        }, { error: "Le type de contrat est requis." }),
        reference: t.String({ error: "La référence est requise." })
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
    body: t.Object({
        type: t.Enum({
            CONTRACT: "CONTRACT",
            MANDATE: "MANDATE",
        }, { error: "Le type de contrat est requis." }),
        rental: t.Optional(t.String()),
        building: t.Optional(t.String()),
        period: t.Object({
            from: t.Transform(t.String({ error: "La date de début est requise." }))
                .Decode(value => new Date(value))
                .Encode(value => value.toISOString()),
            to: t.Optional(
                t.Transform(t.String({ error: "La date de fin est requise." }))
                    .Decode(value => new Date(value))
                    .Encode(value => value.toISOString())
            ),
        }, { error: "La période est requise." }),
        note: t.Optional(t.String()),
    }),
    mailBody: t.Object({
        id: t.String({ error: "L'identifiant est requis" }),
        type: t.Enum({
            CONTRACT: "CONTRACT",
            MANDATE: "MANDATE",
        }, { error: "Le type de contrat est requis." }),
        emails: t.Transform((t.String()))
            .Decode((value) => JSON.parse(value) as string[])
            .Encode((value) => JSON.stringify(value)),
        subject: t.Optional(t.String()),
        message: t.Optional(t.String()),
        files: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    })
}