import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AppearencePlain = t.Object(
  { id: t.String(), logo: t.String() },
  { additionalProperties: false },
);

export const AppearenceRelations = t.Object(
  {},
  { additionalProperties: false },
);

export const AppearencePlainInputCreate = t.Object(
  { logo: t.String() },
  { additionalProperties: false },
);

export const AppearencePlainInputUpdate = t.Object(
  { logo: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const AppearenceRelationsInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const AppearenceRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: false }),
);

export const AppearenceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          logo: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Appearence" },
  ),
);

export const AppearenceWhereUnique = t.Recursive(
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
            { id: t.String(), logo: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Appearence" },
);

export const AppearenceSelect = t.Partial(
  t.Object(
    { id: t.Boolean(), logo: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AppearenceInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: false }),
);

export const AppearenceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      logo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Appearence = t.Composite([AppearencePlain, AppearenceRelations], {
  additionalProperties: false,
});

export const AppearenceInputCreate = t.Composite(
  [AppearencePlainInputCreate, AppearenceRelationsInputCreate],
  { additionalProperties: false },
);

export const AppearenceInputUpdate = t.Composite(
  [AppearencePlainInputUpdate, AppearenceRelationsInputUpdate],
  { additionalProperties: false },
);
