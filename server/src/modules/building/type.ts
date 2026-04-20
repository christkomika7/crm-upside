import { t } from "elysia";


export default {
    queryFilter: t.Object({
        page: t.Optional(t.String()),
        pageSize: t.Optional(t.String()),
        search: t.Optional(t.String()),
        filter: t.Optional(t.String()),
    }),
    body: t.Object({
        name: t.String({ error: "Le nom est requis" }),
        reference: t.String({ error: "La référence est requise" }),
        location: t.String({ error: "L'emplacement est requis" }),
        constructionDate: t.Transform(t.String({ error: "La date de construction est requise" }))
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
        lotType: t.Transform(t.String({ error: "Le type de lot est requis" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        elevator: t.Transform(t.String({ error: "L'ascenseur est requis" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        parking: t.Transform(t.String({ error: "Le parking est requis" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        security: t.Transform(t.String({ error: "La sécurité est requise" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        camera: t.Transform(t.String({ error: "La caméra est requise" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        pool: t.Transform(t.String({ error: "La piscine est requise" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        generator: t.Transform(t.String({ error: "Le générateur est requis" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        waterBorehole: t.Transform(t.String({ error: "Le forage est requis" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        gym: t.Transform(t.String({ error: "La salle de sport est requise" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        garden: t.Transform(t.String({ error: "Le jardin est requis" }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        status: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        map: t.String({ error: "La carte est requise" }),
        photos: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
        deeds: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    paramId: t.Object({ id: t.String({ error: "L'identifiant est requis" }) }),
    paramOwnerId: t.Object({ ownerId: t.String({ error: "L'identifiant du propriétaire est requis" }) })
} 