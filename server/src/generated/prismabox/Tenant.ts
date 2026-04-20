import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TenantPlain = t.Object(
  {
    id: t.String(),
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
);

export const TenantRelations = t.Object(
  {
    rentals: t.Array(
      t.Object(
        {
          id: t.String(),
          tenantId: t.String(),
          unitId: t.String(),
          isDeleting: t.Boolean(),
          price: t.Number(),
          start: t.Date(),
          end: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    invoices: t.Array(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          price: t.Number(),
          amountPaid: t.Number(),
          discount: t.Number(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("OVERDUE")],
            { additionalProperties: false },
          ),
          discountType: t.Union([t.Literal("PERCENT"), t.Literal("MONEY")], {
            additionalProperties: false,
          }),
          hasTax: t.Boolean(),
          type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          ownerId: __nullable__(t.String()),
          tenantId: __nullable__(t.String()),
          note: __nullable__(t.String()),
          start: t.Date(),
          end: t.Date(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    quotes: t.Array(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          price: t.Number(),
          discount: t.Number(),
          discountType: t.Union([t.Literal("PERCENT"), t.Literal("MONEY")], {
            additionalProperties: false,
          }),
          hasTax: t.Boolean(),
          type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          isComplete: t.Boolean(),
          ownerId: __nullable__(t.String()),
          tenantId: __nullable__(t.String()),
          note: __nullable__(t.String()),
          start: t.Date(),
          end: t.Date(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    appointments: t.Array(
      t.Object(
        {
          id: t.String(),
          type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          ownerId: __nullable__(t.String()),
          tenantId: __nullable__(t.String()),
          date: t.Date(),
          hour: t.String(),
          minutes: t.String(),
          address: t.String(),
          subject: t.String(),
          note: t.String(),
          isComplete: t.Boolean(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    checkInOuts: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const TenantPlainInputCreate = t.Object(
  {
    isDiplomatic: t.Optional(t.Boolean()),
    isPersonal: t.Optional(t.Boolean()),
    firstname: t.String(),
    lastname: t.String(),
    company: t.Optional(__nullable__(t.String())),
    phone: t.String(),
    email: t.String(),
    address: t.String(),
    maritalStatus: t.Optional(__nullable__(t.String())),
    income: t.Optional(__nullable__(t.Number())),
    bankInfo: t.String(),
    paymentMode: t.Array(t.String(), { additionalProperties: false }),
    documents: t.Array(t.String(), { additionalProperties: false }),
    monthlyRent: t.Optional(t.Number()),
    monthlyCharges: t.Optional(t.Number()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const TenantPlainInputUpdate = t.Object(
  {
    isDiplomatic: t.Optional(t.Boolean()),
    isPersonal: t.Optional(t.Boolean()),
    firstname: t.Optional(t.String()),
    lastname: t.Optional(t.String()),
    company: t.Optional(__nullable__(t.String())),
    phone: t.Optional(t.String()),
    email: t.Optional(t.String()),
    address: t.Optional(t.String()),
    maritalStatus: t.Optional(__nullable__(t.String())),
    income: t.Optional(__nullable__(t.Number())),
    bankInfo: t.Optional(t.String()),
    paymentMode: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    documents: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    monthlyRent: t.Optional(t.Number()),
    monthlyCharges: t.Optional(t.Number()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const TenantRelationsInputCreate = t.Object(
  {
    rentals: t.Optional(
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
    invoices: t.Optional(
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
    quotes: t.Optional(
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
    appointments: t.Optional(
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
    checkInOuts: t.Optional(
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

export const TenantRelationsInputUpdate = t.Partial(
  t.Object(
    {
      rentals: t.Partial(
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
      invoices: t.Partial(
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
      quotes: t.Partial(
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
      appointments: t.Partial(
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
      checkInOuts: t.Partial(
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

export const TenantWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          isDiplomatic: t.Boolean(),
          isPersonal: t.Boolean(),
          firstname: t.String(),
          lastname: t.String(),
          company: t.String(),
          phone: t.String(),
          email: t.String(),
          address: t.String(),
          maritalStatus: t.String(),
          income: t.Number(),
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
    { $id: "Tenant" },
  ),
);

export const TenantWhereUnique = t.Recursive(
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
              isDiplomatic: t.Boolean(),
              isPersonal: t.Boolean(),
              firstname: t.String(),
              lastname: t.String(),
              company: t.String(),
              phone: t.String(),
              email: t.String(),
              address: t.String(),
              maritalStatus: t.String(),
              income: t.Number(),
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Tenant" },
);

export const TenantSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      isDiplomatic: t.Boolean(),
      isPersonal: t.Boolean(),
      firstname: t.Boolean(),
      lastname: t.Boolean(),
      company: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      address: t.Boolean(),
      maritalStatus: t.Boolean(),
      income: t.Boolean(),
      bankInfo: t.Boolean(),
      paymentMode: t.Boolean(),
      documents: t.Boolean(),
      monthlyRent: t.Boolean(),
      monthlyCharges: t.Boolean(),
      depositPaid: t.Boolean(),
      rentals: t.Boolean(),
      invoices: t.Boolean(),
      quotes: t.Boolean(),
      appointments: t.Boolean(),
      checkInOuts: t.Boolean(),
      isDeleting: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TenantInclude = t.Partial(
  t.Object(
    {
      rentals: t.Boolean(),
      invoices: t.Boolean(),
      quotes: t.Boolean(),
      appointments: t.Boolean(),
      checkInOuts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TenantOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDiplomatic: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isPersonal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      firstname: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastname: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      company: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maritalStatus: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      income: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bankInfo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentMode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documents: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      monthlyRent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      monthlyCharges: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      depositPaid: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Tenant = t.Composite([TenantPlain, TenantRelations], {
  additionalProperties: false,
});

export const TenantInputCreate = t.Composite(
  [TenantPlainInputCreate, TenantRelationsInputCreate],
  { additionalProperties: false },
);

export const TenantInputUpdate = t.Composite(
  [TenantPlainInputUpdate, TenantRelationsInputUpdate],
  { additionalProperties: false },
);
