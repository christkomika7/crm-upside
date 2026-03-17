import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxPlain = t.Object(
  { id: t.String(), name: t.String(), value: t.String() },
  { additionalProperties: false },
);

export const TaxRelations = t.Object({}, { additionalProperties: false });

export const TaxPlainInputCreate = t.Object(
  { name: t.String(), value: t.String() },
  { additionalProperties: false },
);

export const TaxPlainInputUpdate = t.Object(
  { name: t.Optional(t.String()), value: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const TaxRelationsInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const TaxRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: false }),
);

export const TaxWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          value: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Tax" },
  ),
);

export const TaxWhereUnique = t.Recursive(
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
            { id: t.String(), name: t.String(), value: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Tax" },
);

export const TaxSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      value: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaxInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: false }),
);

export const TaxOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      value: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Tax = t.Composite([TaxPlain, TaxRelations], {
  additionalProperties: false,
});

export const TaxInputCreate = t.Composite(
  [TaxPlainInputCreate, TaxRelationsInputCreate],
  { additionalProperties: false },
);

export const TaxInputUpdate = t.Composite(
  [TaxPlainInputUpdate, TaxRelationsInputUpdate],
  { additionalProperties: false },
);
