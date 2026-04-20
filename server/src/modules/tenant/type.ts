import { t } from "elysia";


export default {
    body: t.Object({
        isPersonal: t.Transform(t.String({ error: "Le type de locataire est requis." }))
            .Decode(value => JSON.parse(value))
            .Encode(value => value.toString()),
        isDiplomatic: t.Transform(t.String({ error: "Le statut diplomatique est requis." }))
            .Decode(value => JSON.parse(value))
            .Encode(value => value.toString()),
        firstname: t.String({ error: "Le prénom est requis." }),
        lastname: t.String({ error: "Le nom est requis." }),
        company: t.Optional(t.String()),
        phone: t.String({ error: "Le numéro de téléphone est requis." }),
        email: t.String({ error: "L'email est requis." }),
        address: t.String({ error: "L'adresse est requise." }),
        income: t.Optional(t.String()),
        maritalStatus: t.Optional(t.String()),
        bankInfo: t.String({ error: "Les informations bancaires sont requises." }),
        paymentMode: t.Transform(t.String({ error: "Le mode de paiement est requis." }))
            .Decode(value => JSON.parse(value))
            .Encode(value => value.toString()),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    queryFilter: t.Object({
        page: t.Optional(t.String()),
        pageSize: t.Optional(t.String()),
        search: t.Optional(t.String()),
        filter: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        sortOrder: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
    }),
    params: t.Object({ id: t.String() })
} 
