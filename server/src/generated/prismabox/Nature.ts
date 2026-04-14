import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NaturePlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
      additionalProperties: false,
    }),
    categoryId: t.String(),
  },
  { additionalProperties: false },
);

export const NatureRelations = t.Object(
  {
    category: t.Object(
      {
        id: t.String(),
        accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
          additionalProperties: false,
        }),
        name: t.String(),
      },
      { additionalProperties: false },
    ),
    secondNatures: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
            additionalProperties: false,
          }),
          natureId: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accountings: t.Array(
      t.Object(
        {
          id: t.String(),
          date: t.Date(),
          type: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
            additionalProperties: false,
          }),
          paymentMode: t.Union(
            [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          isTTC: t.Boolean(),
          checkNumber: __nullable__(t.String()),
          description: t.String(),
          period: __nullable__(t.Date()),
          unitId: __nullable__(t.String()),
          sourceId: t.String(),
          allocationId: __nullable__(t.String()),
          categoryId: t.String(),
          natureId: t.String(),
          secondNatureId: __nullable__(t.String()),
          thirdNatureId: __nullable__(t.String()),
          userId: t.String(),
          documents: t.Array(t.String(), { additionalProperties: false }),
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

export const NaturePlainInputCreate = t.Object(
  {
    name: t.String(),
    accountingType: t.Optional(
      t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const NaturePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    accountingType: t.Optional(
      t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const NatureRelationsInputCreate = t.Object(
  {
    category: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    secondNatures: t.Optional(
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
    accountings: t.Optional(
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

export const NatureRelationsInputUpdate = t.Partial(
  t.Object(
    {
      category: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      secondNatures: t.Partial(
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
      accountings: t.Partial(
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

export const NatureWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
            additionalProperties: false,
          }),
          categoryId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Nature" },
  ),
);

export const NatureWhereUnique = t.Recursive(
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
              name: t.String(),
              accountingType: t.Union(
                [t.Literal("INFLOW"), t.Literal("OUTFLOW")],
                { additionalProperties: false },
              ),
              categoryId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Nature" },
);

export const NatureSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      accountingType: t.Boolean(),
      categoryId: t.Boolean(),
      category: t.Boolean(),
      secondNatures: t.Boolean(),
      accountings: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NatureInclude = t.Partial(
  t.Object(
    {
      accountingType: t.Boolean(),
      category: t.Boolean(),
      secondNatures: t.Boolean(),
      accountings: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NatureOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Nature = t.Composite([NaturePlain, NatureRelations], {
  additionalProperties: false,
});

export const NatureInputCreate = t.Composite(
  [NaturePlainInputCreate, NatureRelationsInputCreate],
  { additionalProperties: false },
);

export const NatureInputUpdate = t.Composite(
  [NaturePlainInputUpdate, NatureRelationsInputUpdate],
  { additionalProperties: false },
);
