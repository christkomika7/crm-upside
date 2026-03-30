import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CumulPlain = t.Object(
  { id: t.String(), name: t.String(), value: t.String() },
  { additionalProperties: false },
);

export const CumulRelations = t.Object(
  {
    taxes: t.Array(
      t.Object(
        { id: t.String(), name: t.String(), value: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CumulPlainInputCreate = t.Object(
  { name: t.String(), value: t.String() },
  { additionalProperties: false },
);

export const CumulPlainInputUpdate = t.Object(
  { name: t.Optional(t.String()), value: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const CumulRelationsInputCreate = t.Object(
  {
    taxes: t.Optional(
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

export const CumulRelationsInputUpdate = t.Partial(
  t.Object(
    {
      taxes: t.Partial(
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

export const CumulWhere = t.Partial(
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
    { $id: "Cumul" },
  ),
);

export const CumulWhereUnique = t.Recursive(
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
  { $id: "Cumul" },
);

export const CumulSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      value: t.Boolean(),
      taxes: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CumulInclude = t.Partial(
  t.Object(
    { taxes: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const CumulOrderBy = t.Partial(
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

export const Cumul = t.Composite([CumulPlain, CumulRelations], {
  additionalProperties: false,
});

export const CumulInputCreate = t.Composite(
  [CumulPlainInputCreate, CumulRelationsInputCreate],
  { additionalProperties: false },
);

export const CumulInputUpdate = t.Composite(
  [CumulPlainInputUpdate, CumulRelationsInputUpdate],
  { additionalProperties: false },
);
