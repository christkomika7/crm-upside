import { t } from "elysia";

export default {
    body: t.Object({
        reference: t.String({ error: "La référence est requise." }),
        description: t.String({ error: "La description est requise." }),
        hasTax: t.Boolean(),
        price: t.Transform(t.String({ error: "Le prix est requis." }))
            .Decode((value) => parseFloat(value))
            .Encode((value) => String(value)),
    }),
    params: t.Object({
        id: t.String({ error: "L'identifiant est requis." })
    }),
} 