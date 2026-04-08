import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CheckInOutPlain = t.Object(
  {
    id: t.String(),
    date: t.Date(),
    tenantId: t.String(),
    unitId: t.String(),
    isChecked: t.Boolean(),
    isDeleting: t.Boolean(),
    documents: t.Array(t.String(), { additionalProperties: false }),
    note: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CheckInOutRelations = t.Object(
  {
    tenant: t.Object(
      {
        id: t.String(),
        firstname: t.String(),
        lastname: t.String(),
        company: t.String(),
        phone: t.String(),
        email: t.String(),
        address: t.String(),
        maritalStatus: __nullable__(t.String()),
        income: t.Number(),
        bankInfo: t.String(),
        paymentMode: t.Union(
          [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
          { additionalProperties: false },
        ),
        documents: t.Array(t.String(), { additionalProperties: false }),
        isDeleting: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    unit: t.Object(
      {
        id: t.String(),
        reference: t.String(),
        rentalStatus: t.String(),
        surface: t.Number(),
        rooms: t.Integer(),
        dining: t.Integer(),
        kitchen: t.Integer(),
        bedroom: t.Integer(),
        bathroom: t.Integer(),
        rent: t.Number(),
        furnished: t.String(),
        wifi: t.Boolean(),
        water: t.Boolean(),
        electricity: t.Boolean(),
        tv: t.Boolean(),
        charges: t.Number(),
        documents: t.Array(t.String(), { additionalProperties: false }),
        isDeleting: t.Boolean(),
        buildingId: t.String(),
        typeId: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CheckInOutPlainInputCreate = t.Object(
  {
    date: t.Date(),
    isChecked: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
    documents: t.Array(t.String(), { additionalProperties: false }),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const CheckInOutPlainInputUpdate = t.Object(
  {
    date: t.Optional(t.Date()),
    isChecked: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
    documents: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const CheckInOutRelationsInputCreate = t.Object(
  {
    tenant: t.Object(
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
    unit: t.Object(
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

export const CheckInOutRelationsInputUpdate = t.Partial(
  t.Object(
    {
      tenant: t.Object(
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
      unit: t.Object(
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

export const CheckInOutWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          date: t.Date(),
          tenantId: t.String(),
          unitId: t.String(),
          isChecked: t.Boolean(),
          isDeleting: t.Boolean(),
          documents: t.Array(t.String(), { additionalProperties: false }),
          note: t.String(),
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
              date: t.Date(),
              tenantId: t.String(),
              unitId: t.String(),
              isChecked: t.Boolean(),
              isDeleting: t.Boolean(),
              documents: t.Array(t.String(), { additionalProperties: false }),
              note: t.String(),
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
      date: t.Boolean(),
      tenantId: t.Boolean(),
      tenant: t.Boolean(),
      unitId: t.Boolean(),
      unit: t.Boolean(),
      isChecked: t.Boolean(),
      isDeleting: t.Boolean(),
      documents: t.Boolean(),
      note: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CheckInOutInclude = t.Partial(
  t.Object(
    { tenant: t.Boolean(), unit: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const CheckInOutOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      date: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tenantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isChecked: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documents: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
