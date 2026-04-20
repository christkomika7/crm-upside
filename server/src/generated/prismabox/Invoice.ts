import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InvoicePlain = t.Object(
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
);

export const InvoiceRelations = t.Object(
  {
    owner: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.String(),
          firstname: t.String(),
          lastname: t.String(),
          company: t.String(),
          phone: t.String(),
          email: t.String(),
          address: t.String(),
          actionnary: t.String(),
          isDeleting: t.Boolean(),
          bankInfo: t.String(),
          documents: t.Array(t.String(), { additionalProperties: false }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    tenant: __nullable__(
      t.Object(
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
      ),
    ),
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          quantity: t.Integer(),
          productServiceId: t.String(),
          price: t.Number(),
          description: t.String(),
          reference: t.String(),
          hasTax: t.Boolean(),
          status: t.Union([t.Literal("USED"), t.Literal("IGNORE")], {
            additionalProperties: false,
          }),
          invoiceId: __nullable__(t.String()),
          quoteId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          purchaseOrderId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    payments: t.Array(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          amount: t.Number(),
          recordType: t.Union(
            [t.Literal("PURCHASE_ORDER"), t.Literal("INVOICE")],
            { additionalProperties: false },
          ),
          type: t.Union(
            [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
            { additionalProperties: false },
          ),
          date: t.Date(),
          invoiceId: __nullable__(t.String()),
          purchaseOrderId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
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

export const InvoicePlainInputCreate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    price: t.Optional(t.Number()),
    discount: t.Optional(t.Number()),
    status: t.Optional(
      t.Union([t.Literal("PENDING"), t.Literal("PAID"), t.Literal("OVERDUE")], {
        additionalProperties: false,
      }),
    ),
    discountType: t.Optional(
      t.Union([t.Literal("PERCENT"), t.Literal("MONEY")], {
        additionalProperties: false,
      }),
    ),
    hasTax: t.Optional(t.Boolean()),
    type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
      additionalProperties: false,
    }),
    note: t.Optional(__nullable__(t.String())),
    start: t.Date(),
    end: t.Date(),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const InvoicePlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    price: t.Optional(t.Number()),
    discount: t.Optional(t.Number()),
    status: t.Optional(
      t.Union([t.Literal("PENDING"), t.Literal("PAID"), t.Literal("OVERDUE")], {
        additionalProperties: false,
      }),
    ),
    discountType: t.Optional(
      t.Union([t.Literal("PERCENT"), t.Literal("MONEY")], {
        additionalProperties: false,
      }),
    ),
    hasTax: t.Optional(t.Boolean()),
    type: t.Optional(
      t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
        additionalProperties: false,
      }),
    ),
    note: t.Optional(__nullable__(t.String())),
    start: t.Optional(t.Date()),
    end: t.Optional(t.Date()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const InvoiceRelationsInputCreate = t.Object(
  {
    owner: t.Optional(
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
    tenant: t.Optional(
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
    items: t.Optional(
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
    payments: t.Optional(
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

export const InvoiceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      owner: t.Partial(
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
      tenant: t.Partial(
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
      items: t.Partial(
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
      payments: t.Partial(
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

export const InvoiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          ownerId: t.String(),
          tenantId: t.String(),
          note: t.String(),
          start: t.Date(),
          end: t.Date(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Invoice" },
  ),
);

export const InvoiceWhereUnique = t.Recursive(
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
              price: t.Number(),
              amountPaid: t.Number(),
              discount: t.Number(),
              status: t.Union(
                [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("OVERDUE")],
                { additionalProperties: false },
              ),
              discountType: t.Union(
                [t.Literal("PERCENT"), t.Literal("MONEY")],
                { additionalProperties: false },
              ),
              hasTax: t.Boolean(),
              type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
                additionalProperties: false,
              }),
              ownerId: t.String(),
              tenantId: t.String(),
              note: t.String(),
              start: t.Date(),
              end: t.Date(),
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
  { $id: "Invoice" },
);

export const InvoiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      price: t.Boolean(),
      amountPaid: t.Boolean(),
      discount: t.Boolean(),
      status: t.Boolean(),
      discountType: t.Boolean(),
      hasTax: t.Boolean(),
      type: t.Boolean(),
      ownerId: t.Boolean(),
      owner: t.Boolean(),
      tenantId: t.Boolean(),
      tenant: t.Boolean(),
      items: t.Boolean(),
      note: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      isDeleting: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      payments: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InvoiceInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      discountType: t.Boolean(),
      type: t.Boolean(),
      owner: t.Boolean(),
      tenant: t.Boolean(),
      items: t.Boolean(),
      payments: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InvoiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amountPaid: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hasTax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tenantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      end: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Invoice = t.Composite([InvoicePlain, InvoiceRelations], {
  additionalProperties: false,
});

export const InvoiceInputCreate = t.Composite(
  [InvoicePlainInputCreate, InvoiceRelationsInputCreate],
  { additionalProperties: false },
);

export const InvoiceInputUpdate = t.Composite(
  [InvoicePlainInputUpdate, InvoiceRelationsInputUpdate],
  { additionalProperties: false },
);
