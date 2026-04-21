import { t } from "elysia";


export default {
    body: t.Object({
        type: t.String({ error: "Veuillez saisir le type" }),
        reference: t.String({ error: "Veuillez saisir la référence" }),
        building: t.String({ error: "Veuillez saisir le bâtiment" }),
        rentalStatus: t.Enum({
            OCCUPED: "OCCUPED",
            FREE: "FREE"
        }, { error: "Veuillez saisir le statut de location" }),
        surface: t.Transform(t.String({ error: "Veuillez saisir la surface" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        livingroom: t.Transform(t.String({ error: "Veuillez saisir le nombre de salon" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        dining: t.Transform(t.String({ error: "Veuillez saisir le nombre de salle à manger" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        kitchen: t.Transform(t.String({ error: "Veuillez saisir le nombre de cuisine" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        bedroom: t.Transform(t.String({ error: "Veuillez saisir le nombre de chambre" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        bathroom: t.Transform(t.String({ error: "Veuillez saisir le nombre de salle de bain" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
        rent: t.Transform(t.String({ error: "Veuillez saisir le loyer" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => value.toString()),
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
        extraCharges: t.String({ error: "Veuillez saisir les extras charges" }),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String({ error: "Veuillez saisir l'identifiant" }) }),
    query: t.Object({ id: t.String({ error: "Veuillez saisir l'identifiant" }) }),
    queryFilter: t.Object({
        page: t.Optional(t.String()),
        pageSize: t.Optional(t.String()),
        search: t.Optional(t.String()),
        filter: t.Optional(t.String()),
    }),
    queryExcept: t.Object({
        except: t.Optional(t.String()),
    }),
} 