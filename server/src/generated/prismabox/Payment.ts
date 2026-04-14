import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentPlain = t.Object(
  {
    id: t.String(),
    reference: t.Integer(),
    amount: t.Number(),
    recordType: t.Union([t.Literal("PURCHASE_ORDER"), t.Literal("INVOICE")], {
      additionalProperties: false,
    }),
    type: t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
      additionalProperties: false,
    }),
    date: t.Date(),
    invoiceId: __nullable__(t.String()),
    purchaseOrderId: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PaymentRelations = t.Object(
  {
    invoice: __nullable__(
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
    ),
    purchaseOrder: __nullable__(
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
          serviceProviderId: t.String(),
          note: __nullable__(t.String()),
          start: t.Date(),
          end: t.Date(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
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

export const PaymentPlainInputCreate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    amount: t.Optional(t.Number()),
    recordType: t.Union([t.Literal("PURCHASE_ORDER"), t.Literal("INVOICE")], {
      additionalProperties: false,
    }),
    type: t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
      additionalProperties: false,
    }),
    date: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const PaymentPlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    amount: t.Optional(t.Number()),
    recordType: t.Optional(
      t.Union([t.Literal("PURCHASE_ORDER"), t.Literal("INVOICE")], {
        additionalProperties: false,
      }),
    ),
    type: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
        additionalProperties: false,
      }),
    ),
    date: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const PaymentRelationsInputCreate = t.Object(
  {
    invoice: t.Optional(
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
    purchaseOrder: t.Optional(
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

export const PaymentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      invoice: t.Partial(
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
      purchaseOrder: t.Partial(
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

export const PaymentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          invoiceId: t.String(),
          purchaseOrderId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Payment" },
  ),
);

export const PaymentWhereUnique = t.Recursive(
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
              invoiceId: t.String(),
              purchaseOrderId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Payment" },
);

export const PaymentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      amount: t.Boolean(),
      recordType: t.Boolean(),
      type: t.Boolean(),
      date: t.Boolean(),
      invoiceId: t.Boolean(),
      invoice: t.Boolean(),
      purchaseOrder: t.Boolean(),
      purchaseOrderId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentInclude = t.Partial(
  t.Object(
    {
      recordType: t.Boolean(),
      type: t.Boolean(),
      invoice: t.Boolean(),
      purchaseOrder: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      date: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      purchaseOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Payment = t.Composite([PaymentPlain, PaymentRelations], {
  additionalProperties: false,
});

export const PaymentInputCreate = t.Composite(
  [PaymentPlainInputCreate, PaymentRelationsInputCreate],
  { additionalProperties: false },
);

export const PaymentInputUpdate = t.Composite(
  [PaymentPlainInputUpdate, PaymentRelationsInputUpdate],
  { additionalProperties: false },
);
