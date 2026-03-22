import { t } from "elysia";


export default {
    body: t.Object({
        type: t.String({ error: "Veuillez saisir le type" }),
        reference: t.String({ error: "Veuillez saisir la référence" }),
        building: t.String({ error: "Veuillez saisir le bâtiment" }),
        rentalStatus: t.String({ error: "Veuillez saisir le statut de location" }),
        surface: t.String({ error: "Veuillez saisir la surface" }),
        rooms: t.String({ error: "Veuillez saisir le nombre de pièces" }),
        rent: t.String({ error: "Veuillez saisir le loyer" }),
        furnished: t.String({ errors: "Veuillez saisir le statut de l'ameublement" }),
        wifi: t.Transform(t.String({ error: "Veuillez saisir le statut du wifi" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        water: t.Transform(t.String({ error: "Veuillez saisir le statut de l'eau" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        electricity: t.Transform(t.String({ error: "Veuillez saisir le statut de l'électricité" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        tv: t.Transform(t.String({ error: "Veuillez saisir le statut de la télévision" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        charges: t.String({ error: "Veuillez saisir les charges" }),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String({ error: "Veuillez saisir l'identifiant" }) }),
    query: t.Object({ id: t.String({ error: "Veuillez saisir l'identifiant" }) })
} 