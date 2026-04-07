import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotePlain = t.Object(
  {
    id: t.String(),
    invoice: t.String(),
    quote: t.String(),
    purchaseOrder: t.String(),
  },
  { additionalProperties: false },
);

export const NoteRelations = t.Object({}, { additionalProperties: false });

export const NotePlainInputCreate = t.Object(
  { invoice: t.String(), quote: t.String(), purchaseOrder: t.String() },
  { additionalProperties: false },
);

export const NotePlainInputUpdate = t.Object(
  {
    invoice: t.Optional(t.String()),
    quote: t.Optional(t.String()),
    purchaseOrder: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const NoteRelationsInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const NoteRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: false }),
);

export const NoteWhere = t.Partial(
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
    { $id: "Note" },
  ),
);

export const NoteWhereUnique = t.Recursive(
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
  { $id: "Note" },
);

export const NoteSelect = t.Partial(
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

export const NoteInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: false }),
);

export const NoteOrderBy = t.Partial(
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

export const Note = t.Composite([NotePlain, NoteRelations], {
  additionalProperties: false,
});

export const NoteInputCreate = t.Composite(
  [NotePlainInputCreate, NoteRelationsInputCreate],
  { additionalProperties: false },
);

export const NoteInputUpdate = t.Composite(
  [NotePlainInputUpdate, NoteRelationsInputUpdate],
  { additionalProperties: false },
);
