import { t } from "elysia";


export default {
    incomeBody: t.Object({
        date: t.Transform(t.String({ error: "Date est requise." }))
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
        taxType: t.Enum({ HT: "HT", TTC: "TTC" }),
        paymentMode: t.Enum({ CASH: "CASH", CHECK: "CHECK", BANK: "BANK" }, { error: "Mode de paiement est requis." }),
        category: t.String({ error: "Catégorie est requise." }),
        nature: t.String({ error: "Nature est requise." }),
        secondNature: t.Optional(t.String()),
        thirdNature: t.Optional(t.String()),
        description: t.String({ error: "Description est requise." }),
        amount: t.String({ error: "Montant est requis." }),
        allocation: t.Optional(t.String()),
        source: t.String({ error: "Source est requise." }),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    outcomeBody: t.Object({
        date: t.Transform(t.String({ error: "Date est requise." }))
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
        category: t.String({ error: "Catégorie est requise." }),
        nature: t.String({ error: "Nature est requise." }),
        secondNature: t.Optional(t.String()),
        thirdNature: t.Optional(t.String()),
        description: t.String({ error: "Description est requise." }),
        amount: t.Number({ error: "Montant est requis." }),
        taxType: t.Enum({ HT: "HT", TTC: "TTC" }),
        paymentMode: t.Enum({ CASH: "CASH", CHECK: "CHECK", BANK: "BANK" }, { error: "Mode de paiement est requis." }),
        checkNumber: t.Optional(t.String()),
        unit: t.Optional(t.String()),
        allocation: t.Optional(t.String()),
        source: t.String({ error: "Source est requise." }),
        period: t.Optional(t.Transform(t.String())
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString())),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String({ error: "Identifiant est requis." }) })
} 