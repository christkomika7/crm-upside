import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SecondNaturePlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
      additionalProperties: false,
    }),
    natureId: t.String(),
  },
  { additionalProperties: false },
);

export const SecondNatureRelations = t.Object(
  {
    nature: t.Object(
      {
        id: t.String(),
        name: t.String(),
        accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
          additionalProperties: false,
        }),
        categoryId: t.String(),
      },
      { additionalProperties: false },
    ),
    thirdNatures: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
            additionalProperties: false,
          }),
          secondNatureId: t.String(),
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

export const SecondNaturePlainInputCreate = t.Object(
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

export const SecondNaturePlainInputUpdate = t.Object(
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

export const SecondNatureRelationsInputCreate = t.Object(
  {
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
    thirdNatures: t.Optional(
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

export const SecondNatureRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      thirdNatures: t.Partial(
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

export const SecondNatureWhere = t.Partial(
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
          natureId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "SecondNature" },
  ),
);

export const SecondNatureWhereUnique = t.Recursive(
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
              natureId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SecondNature" },
);

export const SecondNatureSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      accountingType: t.Boolean(),
      natureId: t.Boolean(),
      nature: t.Boolean(),
      thirdNatures: t.Boolean(),
      accountings: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SecondNatureInclude = t.Partial(
  t.Object(
    {
      accountingType: t.Boolean(),
      nature: t.Boolean(),
      thirdNatures: t.Boolean(),
      accountings: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SecondNatureOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      natureId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SecondNature = t.Composite(
  [SecondNaturePlain, SecondNatureRelations],
  { additionalProperties: false },
);

export const SecondNatureInputCreate = t.Composite(
  [SecondNaturePlainInputCreate, SecondNatureRelationsInputCreate],
  { additionalProperties: false },
);

export const SecondNatureInputUpdate = t.Composite(
  [SecondNaturePlainInputUpdate, SecondNatureRelationsInputUpdate],
  { additionalProperties: false },
);
