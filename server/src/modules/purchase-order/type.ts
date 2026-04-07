import { t } from "elysia";

export default {
    queryType: t.Object({
        type: t.Enum({
            PAID: "PAID",
            UNPAID: "UNPAID",
            ALL: "ALL"
        }, { error: "Le type de facture est requis." })
    }),
    paramsId: t.Object({
        id: t.String({ error: "L'identifiant est requis." })
    }),
    body: t.Object({
        price: t.String({ error: "Le prix est requis." }),
        discount: t.Optional(t.String()),
        discountType: t.Optional(t.Enum({
            PERCENT: "PERCENT",
            MONEY: "MONEY",
        }, { error: "Le type de réduction doit être PERCENT ou MONEY." })),
        hasTax: t.Boolean(),
        client: t.String({ error: "Le client est requis." }),
        items: t.Array(t.Object({
            id: t.String({ error: "L'identifiant est requis." }),
            reference: t.String({ error: "La référence est requise." }),
            description: t.String({ error: "La description est requise." }),
            price: t.Number({ error: "Le prix est requis." }),
            quantity: t.Number({ error: "La quantité est requise." }),
            hasTax: t.Boolean(),
        })),
        start: t.Transform(t.String({ error: "La date de début est requise." }))
            .Decode(value => new Date(value))
            .Encode(value => value.toISOString()),
        end: t.Transform(t.String({ error: "La date de fin est requise." }))
            .Decode(value => new Date(value))
            .Encode(value => value.toISOString()),
        note: t.Optional(t.String()),
    })
}