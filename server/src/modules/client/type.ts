import { t } from "elysia";

export default {
    query: t.Object({
        type: t.Enum({
            OWNER: "OWNER",
            TENANT: "TENANT",
        }, { error: "Le type de client est requis." })
    })
}