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
);

export const accountingRelations = t.Object(
  {
    unit: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.String(),
          rentalStatus: t.Union([t.Literal("FREE"), t.Literal("OCCUPED")], {
            additionalProperties: false,
          }),
          surface: t.Number(),
          livingroom: t.Integer(),
          dining: t.Integer(),
          kitchen: t.Integer(),
          bedroom: t.Integer(),
          bathroom: t.Integer(),
          furnished: t.String(),
          wifi: t.Boolean(),
          water: t.Boolean(),
          electricity: t.Boolean(),
          tv: t.Boolean(),
          description: t.String(),
          rent: t.Number(),
          charges: t.Number(),
          extraCharges: t.Number(),
          amountGenerate: t.Number(),
          documents: t.Array(t.String(), { additionalProperties: false }),
          isDeleting: t.Boolean(),
          buildingId: t.String(),
          typeId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          propertyManagementId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
    ),
    source: t.Object(
      {
        id: t.String(),
        accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
          additionalProperties: false,
        }),
        type: t.Union(
          [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
          { additionalProperties: false },
        ),
        name: t.String(),
      },
      { additionalProperties: false },
    ),
    allocation: __nullable__(
      t.Object(
        {
          id: t.String(),
          accountingType: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
            additionalProperties: false,
          }),
          name: t.String(),
        },
        { additionalProperties: false },
      ),
    ),
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
    secondNature: __nullable__(
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
    ),
    thirdNature: __nullable__(
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
    ),
    user: t.Object(
      {
        id: t.String(),
        email: t.String(),
        createdAt: t.Date(),
        firstname: t.String(),
        lastname: t.String(),
        name: t.String(),
        role: t.Union([t.Literal("ADMIN"), t.Literal("USER")], {
          additionalProperties: false,
        }),
        emailVerified: t.Boolean(),
        image: __nullable__(t.String()),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    notifications: t.Array(
      t.Object(
        {
          id: t.String(),
          type: t.Union([t.Literal("ALERT"), t.Literal("CONFIRM")], {
            additionalProperties: false,
          }),
          active: t.Boolean(),
          for: t.Union(
            [
              t.Literal("APPOINTMENT"),
              t.Literal("ACCOUNTING"),
              t.Literal("INVOICING"),
              t.Literal("RENTAL"),
              t.Literal("PAYMENT"),
              t.Literal("CONTRACT"),
            ],
            { additionalProperties: false },
          ),
          message: __nullable__(t.String()),
          accountingId: __nullable__(t.String()),
          invoiceId: __nullable__(t.String()),
          paymentId: __nullable__(t.String()),
          rentalId: __nullable__(t.String()),
          contractId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          userId: t.String(),
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
    checkNumber: t.Optional(__nullable__(t.String())),
    description: t.String(),
    period: t.Optional(__nullable__(t.Date())),
    documents: t.Array(t.String(), { additionalProperties: false }),
    isDeleting: t.Optional(t.Boolean()),
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
    checkNumber: t.Optional(__nullable__(t.String())),
    description: t.Optional(t.String()),
    period: t.Optional(__nullable__(t.Date())),
    documents: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const accountingRelationsInputCreate = t.Object(
  {
    unit: t.Optional(
      t.Object(
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
    ),
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
    allocation: t.Optional(
      t.Object(
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
    secondNature: t.Optional(
      t.Object(
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
    ),
    thirdNature: t.Optional(
      t.Object(
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
    ),
    user: t.Object(
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
    notifications: t.Optional(
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

export const accountingRelationsInputUpdate = t.Partial(
  t.Object(
    {
      unit: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
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
      allocation: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
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
      secondNature: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      thirdNature: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      user: t.Object(
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
      notifications: t.Partial(
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
          period: t.Date(),
          unitId: t.String(),
          sourceId: t.String(),
          allocationId: t.String(),
          categoryId: t.String(),
          natureId: t.String(),
          secondNatureId: t.String(),
          thirdNatureId: t.String(),
          userId: t.String(),
          documents: t.Array(t.String(), { additionalProperties: false }),
          isDeleting: t.Boolean(),
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
              period: t.Date(),
              unitId: t.String(),
              sourceId: t.String(),
              allocationId: t.String(),
              categoryId: t.String(),
              natureId: t.String(),
              secondNatureId: t.String(),
              thirdNatureId: t.String(),
              userId: t.String(),
              documents: t.Array(t.String(), { additionalProperties: false }),
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
      period: t.Boolean(),
      unitId: t.Boolean(),
      unit: t.Boolean(),
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
      userId: t.Boolean(),
      user: t.Boolean(),
      notifications: t.Boolean(),
      documents: t.Boolean(),
      isDeleting: t.Boolean(),
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
      unit: t.Boolean(),
      source: t.Boolean(),
      allocation: t.Boolean(),
      category: t.Boolean(),
      nature: t.Boolean(),
      secondNature: t.Boolean(),
      thirdNature: t.Boolean(),
      user: t.Boolean(),
      notifications: t.Boolean(),
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
      period: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documents: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
