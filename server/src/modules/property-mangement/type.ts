import { t } from "elysia";
import { DeletionType } from "../../types/deletion";

export default {
    body: t.Object({
        building: t.String({ error: "Le bâtiment est requis." }),
        units: t.Array(t.String(), { minItems: 1, error: "Au moins une Unité est requis." }),
        administrativeManagement: t.Boolean(),
        technicalManagement: t.Boolean(),
        services: t.Optional(t.Array(t.String())),
        observation: t.Optional(t.String()),
        active: t.Boolean(),
        start: t.Transform(t.String({ error: "La date de début est requise." }))
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
        end: t.Transform(t.String({ error: "La date de fin est requise." }))
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
    }),
    params: t.Object({ id: t.String({ error: "L'identifiant est requis." }) }),
    query: t.Object({
        type: t.Enum(DeletionType, { error: "Le type d'action est requis." })
    })
} 