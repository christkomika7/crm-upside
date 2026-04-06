import { t } from "elysia";

export default {
    queryType: t.Object({
        type: t.Enum({
            WAIT: "WAIT",
            EXPIRED: "EXPIRED",
            ALL: "ALL"
        }, { error: "Le type de rendez-vous est requis." })
    }),
    paramsId: t.Object({
        id: t.String({ error: "L'identifiant est requis." })
    }),
    body: t.Object({
        type: t.Enum({
            OWNER: "OWNER",
            TENANT: "TENANT",
        }, { error: "Le type de client est requis." }),
        client: t.String({ error: "Le client est requis." }),
        date: t.Transform(t.String({ error: "La date est requise." }))
            .Decode(value => new Date(value))
            .Encode(value => value.toISOString()),
        hour: t.String({ error: "L'heure est requise." }),
        minutes: t.String({ error: "Les minutes sont requises." }),
        address: t.String({ error: "L'adresse est requise." }),
        subject: t.String({ error: "Le sujet est requis." }),
        teamMembers: t.Array(t.String({ error: "Le membre de l'équipe est requis." }), { minItems: 1, error: "Veuillez sélectionner au moins un membre de l'équipe." }),
        note: t.String({ error: "La note est requise." }),
    })
}