import { t } from "elysia";


export default {
    body: t.Object({
        type: t.String(),
        building: t.String(),
        rentalStatus: t.String(),
        surface: t.String(),
        rooms: t.String(),
        rent: t.String(),
        furnished: t.String(),
        wifi: t.String(),
        water: t.String(),
        electricity: t.String(),
        tv: t.String(),
        charges: t.String(),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String() }),
    query: t.Object({ id: t.String() })
} 