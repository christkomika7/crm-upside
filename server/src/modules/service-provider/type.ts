import { t } from "elysia";


export default {
    body: t.Object({
        profession: t.String({ error: "Profession est requise." }),
        firstname: t.String({ error: "Prénom est requis." }),
        lastname: t.String({ error: "Nom est requis." }),
        company: t.String({ error: "Entreprise est requise." }),
        phone: t.String({ error: "Téléphone est requis." }),
        email: t.String({ error: "Email est requis." }),
        address: t.String({ error: "Adresse est requise." }),
        nif: t.String({ error: "NIF est requis." }),
        registerNumber: t.String({ error: "Numéro d'enregistrement est requis." }),
        paymentMode: t.String({ error: "Mode de paiement est requis." }),
        rating: t.Transform(t.String({ error: "La note est requise." }))
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        rcc: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
        idCard: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
        taxCertificate: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String({ error: "Identifiant est requis." }) })
} 