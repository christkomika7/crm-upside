import { t } from "elysia";
import { DeletionType } from "../../types/deletion";

export default {
    body: t.Object({
        name: t.String({ error: "Le nom du prospect est requis." }),
        contact: t.String({ error: "Le contact est requis." }),
        price: t.String({ error: "Le prix est requis." }),
        start: t.Transform(t.String({ error: "La date de début est requise." }))
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
        end: t.Transform(t.String({ error: "La date de fin est requise." }))
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
        unit: t.String({ error: "L'unité est requise." })
    }),
    params: t.Object({ id: t.String({ error: "L'identifiant est requis." }) }),
    query: t.Object({
        type: t.Enum(DeletionType, { error: "Le type d'action est requis." })
    })
} 