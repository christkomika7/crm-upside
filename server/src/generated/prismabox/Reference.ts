import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReferencePlain = t.Object(
  {
    id: t.String(),
    invoice: t.String(),
    quote: t.String(),
    purchaseOrder: t.String(),
  },
  { additionalProperties: false },
);

export const ReferenceRelations = t.Object({}, { additionalProperties: false });

export const ReferencePlainInputCreate = t.Object(
  { invoice: t.String(), quote: t.String(), purchaseOrder: t.String() },
  { additionalProperties: false },
);

export const ReferencePlainInputUpdate = t.Object(
  {
    invoice: t.Optional(t.String()),
    quote: t.Optional(t.String()),
    purchaseOrder: t.Optional(t.String()),
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
          invoice: t.String(),
          quote: t.String(),
          purchaseOrder: t.String(),
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
              invoice: t.String(),
              quote: t.String(),
              purchaseOrder: t.String(),
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
      invoice: t.Boolean(),
      quote: t.Boolean(),
      purchaseOrder: t.Boolean(),
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
      invoice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      purchaseOrder: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
