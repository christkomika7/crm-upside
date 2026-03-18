import { t } from "elysia";


export default {
    body: t.Object({
        name: t.String(),
        location: t.String(),
        constructionDate: t.Transform(t.String())
            .Decode((value) => new Date(value))
            .Encode((value) => value.toISOString()),
        lotType: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        door: t.String(),
        elevator: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        parking: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        security: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        camera: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        pool: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        generator: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        waterBorehole: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        gym: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        garden: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        parkingPrice: t.String(),
        status: t.Transform(t.String())
            .Decode((value) => JSON.parse(value))
            .Encode((value) => JSON.stringify(value)),
        map: t.String(),
        photos: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
        deeds: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
        documents: t.Optional(t.Union([t.Files(), t.Array(t.Files())])),
    }),
    params: t.Object({ id: t.String() })
} 