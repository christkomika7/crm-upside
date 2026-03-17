import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReferencePlain = t.Object(
  {
    id: t.String(),
    owner: t.String(),
    building: t.String(),
    unit: t.String(),
    rental: t.String(),
    invoicing: t.String(),
    contract: t.String(),
    checkIn: t.String(),
  },
  { additionalProperties: false },
);

export const ReferenceRelations = t.Object({}, { additionalProperties: false });

export const ReferencePlainInputCreate = t.Object(
  {
    owner: t.String(),
    building: t.String(),
    unit: t.String(),
    rental: t.String(),
    invoicing: t.String(),
    contract: t.String(),
    checkIn: t.String(),
  },
  { additionalProperties: false },
);

export const ReferencePlainInputUpdate = t.Object(
  {
    owner: t.Optional(t.String()),
    building: t.Optional(t.String()),
    unit: t.Optional(t.String()),
    rental: t.Optional(t.String()),
    invoicing: t.Optional(t.String()),
    contract: t.Optional(t.String()),
    checkIn: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const ReferenceRelationsInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const ReferenceRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: false }),
);

export const ReferenceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          owner: t.String(),
          building: t.String(),
          unit: t.String(),
          rental: t.String(),
          invoicing: t.String(),
          contract: t.String(),
          checkIn: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Reference" },
  ),
);

export const ReferenceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              owner: t.String(),
              building: t.String(),
              unit: t.String(),
              rental: t.String(),
              invoicing: t.String(),
              contract: t.String(),
              checkIn: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Reference" },
);

export const ReferenceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      owner: t.Boolean(),
      building: t.Boolean(),
      unit: t.Boolean(),
      rental: t.Boolean(),
      invoicing: t.Boolean(),
      contract: t.Boolean(),
      checkIn: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ReferenceInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: false }),
);

export const ReferenceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      owner: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      building: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rental: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoicing: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contract: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checkIn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Reference = t.Composite([ReferencePlain, ReferenceRelations], {
  additionalProperties: false,
});

export const ReferenceInputCreate = t.Composite(
  [ReferencePlainInputCreate, ReferenceRelationsInputCreate],
  { additionalProperties: false },
);

export const ReferenceInputUpdate = t.Composite(
  [ReferencePlainInputUpdate, ReferenceRelationsInputUpdate],
  { additionalProperties: false },
);
