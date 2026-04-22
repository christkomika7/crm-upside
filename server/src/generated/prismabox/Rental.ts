import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RentalPlain = t.Object(
  {
    id: t.String(),
    reference: t.Integer(),
    tenantId: t.String(),
    unitId: t.String(),
    isDeleting: t.Boolean(),
    price: t.Number(),
    charges: t.Number(),
    extrasCharges: t.Number(),
    furnished: t.String(),
    start: t.Date(),
    end: t.Date(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RentalRelations = t.Object(
  {
    tenant: t.Object(
      {
        id: t.String(),
        reference: t.Integer(),
        isDiplomatic: t.Boolean(),
        isPersonal: t.Boolean(),
        firstname: t.String(),
        lastname: t.String(),
        company: __nullable__(t.String()),
        phone: t.String(),
        email: t.String(),
        address: t.String(),
        maritalStatus: __nullable__(t.String()),
        income: __nullable__(t.Number()),
        bankInfo: t.String(),
        paymentMode: t.Array(t.String(), { additionalProperties: false }),
        documents: t.Array(t.String(), { additionalProperties: false }),
        monthlyRent: t.Number(),
        monthlyCharges: t.Number(),
        depositPaid: t.Number(),
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
    contracts: t.Array(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          type: t.Union([t.Literal("CONTRACT"), t.Literal("MANDATE")], {
            additionalProperties: false,
          }),
          rentalId: __nullable__(t.String()),
          buildingId: __nullable__(t.String()),
          isCanceled: t.Boolean(),
          isDeleting: t.Boolean(),
          updatedAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
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

export const RentalPlainInputCreate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    isDeleting: t.Optional(t.Boolean()),
    price: t.Optional(t.Number()),
    charges: t.Optional(t.Number()),
    extrasCharges: t.Optional(t.Number()),
    furnished: t.String(),
    start: t.Date(),
    end: t.Date(),
  },
  { additionalProperties: false },
);

export const RentalPlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    isDeleting: t.Optional(t.Boolean()),
    price: t.Optional(t.Number()),
    charges: t.Optional(t.Number()),
    extrasCharges: t.Optional(t.Number()),
    furnished: t.Optional(t.String()),
    start: t.Optional(t.Date()),
    end: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const RentalRelationsInputCreate = t.Object(
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
    contracts: t.Optional(
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

export const RentalRelationsInputUpdate = t.Partial(
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
      contracts: t.Partial(
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

export const RentalWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          reference: t.Integer(),
          tenantId: t.String(),
          unitId: t.String(),
          isDeleting: t.Boolean(),
          price: t.Number(),
          charges: t.Number(),
          extrasCharges: t.Number(),
          furnished: t.String(),
          start: t.Date(),
          end: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Rental" },
  ),
);

export const RentalWhereUnique = t.Recursive(
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
              reference: t.Integer(),
              tenantId: t.String(),
              unitId: t.String(),
              isDeleting: t.Boolean(),
              price: t.Number(),
              charges: t.Number(),
              extrasCharges: t.Number(),
              furnished: t.String(),
              start: t.Date(),
              end: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Rental" },
);

export const RentalSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      tenantId: t.Boolean(),
      tenant: t.Boolean(),
      unitId: t.Boolean(),
      unit: t.Boolean(),
      isDeleting: t.Boolean(),
      price: t.Boolean(),
      charges: t.Boolean(),
      extrasCharges: t.Boolean(),
      furnished: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      contracts: t.Boolean(),
      notifications: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RentalInclude = t.Partial(
  t.Object(
    {
      tenant: t.Boolean(),
      unit: t.Boolean(),
      contracts: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RentalOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tenantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      charges: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      extrasCharges: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      furnished: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      end: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Rental = t.Composite([RentalPlain, RentalRelations], {
  additionalProperties: false,
});

export const RentalInputCreate = t.Composite(
  [RentalPlainInputCreate, RentalRelationsInputCreate],
  { additionalProperties: false },
);

export const RentalInputUpdate = t.Composite(
  [RentalPlainInputUpdate, RentalRelationsInputUpdate],
  { additionalProperties: false },
);
