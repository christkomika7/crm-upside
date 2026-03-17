import { t } from "elysia";


export default {
    body: t.Object({
        tenant: t.String(),
        building: t.String(),
        unit: t.String(),
        price: t.String(),
        start: t.Transform(t.String())
            .Decode(value => new Date(value) as Date)
            .Encode(value => JSON.stringify(value)),
        end: t.Transform(t.String())
            .Decode(value => new Date(value) as Date)
            .Encode(value => JSON.stringify(value)),
    }),
    params: t.Object({ id: t.String() })
}


