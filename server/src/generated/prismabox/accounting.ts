import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const accountingPlain = t.Object(
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
    checkNumber: t.String(),
    description: t.String(),
    sourceId: t.String(),
    allocationId: t.String(),
    categoryId: t.String(),
    natureId: t.String(),
    secondNatureId: t.String(),
    thirdNatureId: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const accountingRelations = t.Object(
  {
    source: t.Object(
      {
        id: t.String(),
        type: t.Union(
          [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
          { additionalProperties: false },
        ),
        name: t.String(),
      },
      { additionalProperties: false },
    ),
    allocation: t.Object(
      { id: t.String(), name: t.String() },
      { additionalProperties: false },
    ),
    category: t.Object(
      { id: t.String(), name: t.String() },
      { additionalProperties: false },
    ),
    nature: t.Object(
      { id: t.String(), name: t.String(), categoryId: t.String() },
      { additionalProperties: false },
    ),
    secondNature: t.Object(
      { id: t.String(), name: t.String(), natureId: t.String() },
      { additionalProperties: false },
    ),
    thirdNature: t.Object(
      { id: t.String(), name: t.String(), secondNatureId: t.String() },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const accountingPlainInputCreate = t.Object(
  {
    date: t.Date(),
    type: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
      additionalProperties: false,
    }),
    paymentMode: t.Union(
      [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
      { additionalProperties: false },
    ),
    amount: t.Optional(t.Number()),
    isTTC: t.Boolean(),
    checkNumber: t.String(),
    description: t.String(),
  },
  { additionalProperties: false },
);

export const accountingPlainInputUpdate = t.Object(
  {
    date: t.Optional(t.Date()),
    type: t.Optional(
      t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
        additionalProperties: false,
      }),
    ),
    paymentMode: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
        additionalProperties: false,
      }),
    ),
    amount: t.Optional(t.Number()),
    isTTC: t.Optional(t.Boolean()),
    checkNumber: t.Optional(t.String()),
    description: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const accountingRelationsInputCreate = t.Object(
  {
    source: t.Object(
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
    allocation: t.Object(
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
    nature: t.Object(
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
    secondNature: t.Object(
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
    thirdNature: t.Object(
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
  },
  { additionalProperties: false },
);

export const accountingRelationsInputUpdate = t.Partial(
  t.Object(
    {
      source: t.Object(
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
      allocation: t.Object(
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
      nature: t.Object(
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
      secondNature: t.Object(
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
      thirdNature: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const accountingWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          checkNumber: t.String(),
          description: t.String(),
          sourceId: t.String(),
          allocationId: t.String(),
          categoryId: t.String(),
          natureId: t.String(),
          secondNatureId: t.String(),
          thirdNatureId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "accounting" },
  ),
);

export const accountingWhereUnique = t.Recursive(
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
              checkNumber: t.String(),
              description: t.String(),
              sourceId: t.String(),
              allocationId: t.String(),
              categoryId: t.String(),
              natureId: t.String(),
              secondNatureId: t.String(),
              thirdNatureId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "accounting" },
);

export const accountingSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      date: t.Boolean(),
      type: t.Boolean(),
      paymentMode: t.Boolean(),
      amount: t.Boolean(),
      isTTC: t.Boolean(),
      checkNumber: t.Boolean(),
      description: t.Boolean(),
      sourceId: t.Boolean(),
      source: t.Boolean(),
      allocationId: t.Boolean(),
      allocation: t.Boolean(),
      categoryId: t.Boolean(),
      category: t.Boolean(),
      natureId: t.Boolean(),
      nature: t.Boolean(),
      secondNatureId: t.Boolean(),
      secondNature: t.Boolean(),
      thirdNatureId: t.Boolean(),
      thirdNature: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const accountingInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      paymentMode: t.Boolean(),
      source: t.Boolean(),
      allocation: t.Boolean(),
      category: t.Boolean(),
      nature: t.Boolean(),
      secondNature: t.Boolean(),
      thirdNature: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const accountingOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      date: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isTTC: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checkNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allocationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      natureId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      secondNatureId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      thirdNatureId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const accounting = t.Composite([accountingPlain, accountingRelations], {
  additionalProperties: false,
});

export const accountingInputCreate = t.Composite(
  [accountingPlainInputCreate, accountingRelationsInputCreate],
  { additionalProperties: false },
);

export const accountingInputUpdate = t.Composite(
  [accountingPlainInputUpdate, accountingRelationsInputUpdate],
  { additionalProperties: false },
);
