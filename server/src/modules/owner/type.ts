import { t } from "elysia";


export default {
    body: t.Object({
        buildings: t.Transform(t.String({ error: "Bâtiments est requis." }))
            .Decode((value) => JSON.parse(value) as string[])
            .Encode((value) => JSON.stringify(value)),
        firstname: t.String({ error: "Prénom est requis." }),
        lastname: t.String({ error: "Nom est requis." }),
        company: t.Optional(t.String()),
        phone: t.String({ error: "Téléphone est requis." }),
        email: t.String({ error: "Email est requis." }),
        address: t.String({ error: "Adresse est requise." }),
        actionnary: t.Optional(t.String()),
        bankInfo: t.String({ error: "Informations bancaires est requise." }),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String({ error: "Identifiant est requis." }) })
} 