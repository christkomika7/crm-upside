import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LotTypePlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const LotTypeRelations = t.Object(
  {
    building: t.Array(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          name: t.String(),
          location: t.String(),
          constructionDate: t.Date(),
          door: t.Integer(),
          parkingPrice: t.Number(),
          security: t.Boolean(),
          camera: t.Boolean(),
          elevator: t.Boolean(),
          parking: t.Boolean(),
          pool: t.Boolean(),
          generator: t.Boolean(),
          waterBorehole: t.Boolean(),
          gym: t.Boolean(),
          garden: t.Boolean(),
          status: t.Array(t.String(), { additionalProperties: false }),
          map: t.String(),
          photos: t.Array(t.String(), { additionalProperties: false }),
          deeds: t.Array(t.String(), { additionalProperties: false }),
          documents: t.Array(t.String(), { additionalProperties: false }),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const LotTypePlainInputCreate = t.Object(
  { name: t.String() },
  { additionalProperties: false },
);

export const LotTypePlainInputUpdate = t.Object(
  { name: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const LotTypeRelationsInputCreate = t.Object(
  {
    building: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const LotTypeRelationsInputUpdate = t.Partial(
  t.Object(
    {
      building: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const LotTypeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LotType" },
  ),
);

export const LotTypeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), name: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ name: t.String() })],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              name: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LotType" },
);

export const LotTypeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      building: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LotTypeInclude = t.Partial(
  t.Object(
    { building: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const LotTypeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const LotType = t.Composite([LotTypePlain, LotTypeRelations], {
  additionalProperties: false,
});

export const LotTypeInputCreate = t.Composite(
  [LotTypePlainInputCreate, LotTypeRelationsInputCreate],
  { additionalProperties: false },
);

export const LotTypeInputUpdate = t.Composite(
  [LotTypePlainInputUpdate, LotTypeRelationsInputUpdate],
  { additionalProperties: false },
);
