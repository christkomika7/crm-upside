import { t } from "elysia";


export default {
    body: t.Object({
        firstname: t.String({ error: "Le prénom est requis." }),
        lastname: t.String({ error: "Le nom est requis." }),
        company: t.String({ error: "L'entreprise est requise." }),
        phone: t.String({ error: "Le numéro de téléphone est requis." }),
        email: t.String({ error: "L'email est requis." }),
        address: t.String({ error: "L'adresse est requise." }),
        income: t.String({ error: "Le revenu est requis." }),
        maritalStatus: t.String({ error: "Le statut marital est requis." }),
        bankInfo: t.String({ error: "Les informations bancaires sont requises." }),
        paymentMode: t.String({ error: "Le mode de paiement est requis." }),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String() })
} 