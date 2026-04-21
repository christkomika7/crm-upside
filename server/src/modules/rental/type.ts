import { t } from "elysia";


export default {
    body: t.Object({
        tenant: t.String({ error: "Le locataire est requis" }),
        unit: t.String({ error: "La chambre est requise" }),
        price: t.Optional(t.String()),
        charges: t.Optional(t.String()),
        extrasCharges: t.Optional(t.String()),
        furnished: t.Optional(t.String()),
        start: t.Transform(t.String({ error: "La date de début est requise" }))
            .Decode(value => new Date(value) as Date)
            .Encode(value => JSON.stringify(value)),
        end: t.Transform(t.String({ error: "La date de fin est requise" }))
            .Decode(value => new Date(value) as Date)
            .Encode(value => JSON.stringify(value)),
    }),
    params: t.Object({ id: t.String({ error: "L'identifiant est requis" }) })
}


