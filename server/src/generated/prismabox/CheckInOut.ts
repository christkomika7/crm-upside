import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CheckInOutPlain = t.Object(
  {
    id: t.String(),
    isChecked: t.Boolean(),
    isDeleting: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CheckInOutRelations = t.Object(
  {},
  { additionalProperties: false },
);

export const CheckInOutPlainInputCreate = t.Object(
  { isChecked: t.Optional(t.Boolean()), isDeleting: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const CheckInOutPlainInputUpdate = t.Object(
  { isChecked: t.Optional(t.Boolean()), isDeleting: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const CheckInOutRelationsInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const CheckInOutRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: false }),
);

export const CheckInOutWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          isChecked: t.Boolean(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CheckInOut" },
  ),
);

export const CheckInOutWhereUnique = t.Recursive(
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
              isChecked: t.Boolean(),
              isDeleting: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CheckInOut" },
);

export const CheckInOutSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      isChecked: t.Boolean(),
      isDeleting: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CheckInOutInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: false }),
);

export const CheckInOutOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isChecked: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CheckInOut = t.Composite([CheckInOutPlain, CheckInOutRelations], {
  additionalProperties: false,
});

export const CheckInOutInputCreate = t.Composite(
  [CheckInOutPlainInputCreate, CheckInOutRelationsInputCreate],
  { additionalProperties: false },
);

export const CheckInOutInputUpdate = t.Composite(
  [CheckInOutPlainInputUpdate, CheckInOutRelationsInputUpdate],
  { additionalProperties: false },
);
