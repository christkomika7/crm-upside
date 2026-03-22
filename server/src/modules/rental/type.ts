import { t } from "elysia";


export default {
    body: t.Object({
        tenant: t.String({ error: "Le locataire est requis" }),
        unit: t.String({ error: "La chambre est requise" }),
        price: t.String({ error: "Le prix est requis" }),
        start: t.Transform(t.String({ error: "La date de début est requise" }))
            .Decode(value => new Date(value) as Date)
            .Encode(value => JSON.stringify(value)),
        end: t.Transform(t.String({ error: "La date de fin est requise" }))
            .Decode(value => new Date(value) as Date)
            .Encode(value => JSON.stringify(value)),
    }),
    params: t.Object({ id: t.String({ error: "L'identifiant est requis" }) })
}


