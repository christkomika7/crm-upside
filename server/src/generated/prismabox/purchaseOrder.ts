import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const purchaseOrderPlain = t.Object(
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
);

export const purchaseOrderRelations = t.Object(
  {
    serviceProvider: t.Object(
      {
        id: t.String(),
        firstname: t.String(),
        lastname: t.String(),
        company: t.String(),
        phone: t.String(),
        email: t.String(),
        address: t.String(),
        nif: t.String(),
        registerNumber: t.String(),
        paymentMode: t.Union(
          [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
          { additionalProperties: false },
        ),
        note: t.Number(),
        comment: __nullable__(t.String()),
        isDeleting: t.Boolean(),
        professionId: t.String(),
        rcc: __nullable__(t.String()),
        idCard: __nullable__(t.String()),
        taxCertificate: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          type: t.Union([t.Literal("ITEM"), t.Literal("UNIT")], {
            additionalProperties: false,
          }),
          quantity: t.Integer(),
          productServiceId: __nullable__(t.String()),
          unitId: __nullable__(t.String()),
          price: t.Number(),
          charges: __nullable__(t.Number()),
          extraCharges: __nullable__(t.Number()),
          start: __nullable__(t.Date()),
          end: __nullable__(t.Date()),
          description: t.String(),
          reference: t.String(),
          hasTax: t.Boolean(),
          status: t.Union([t.Literal("USED"), t.Literal("IGNORE")], {
            additionalProperties: false,
          }),
          invoiceId: __nullable__(t.String()),
          quoteId: __nullable__(t.String()),
          purchaseOrderId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
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
  },
  { additionalProperties: false },
);

export const purchaseOrderPlainInputCreate = t.Object(
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
    note: t.Optional(__nullable__(t.String())),
    start: t.Date(),
    end: t.Date(),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const purchaseOrderPlainInputUpdate = t.Object(
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
    note: t.Optional(__nullable__(t.String())),
    start: t.Optional(t.Date()),
    end: t.Optional(t.Date()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const purchaseOrderRelationsInputCreate = t.Object(
  {
    serviceProvider: t.Object(
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
  },
  { additionalProperties: false },
);

export const purchaseOrderRelationsInputUpdate = t.Partial(
  t.Object(
    {
      serviceProvider: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const purchaseOrderWhere = t.Partial(
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
          serviceProviderId: t.String(),
          note: t.String(),
          start: t.Date(),
          end: t.Date(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "purchaseOrder" },
  ),
);

export const purchaseOrderWhereUnique = t.Recursive(
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
              serviceProviderId: t.String(),
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
  { $id: "purchaseOrder" },
);

export const purchaseOrderSelect = t.Partial(
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
      serviceProviderId: t.Boolean(),
      serviceProvider: t.Boolean(),
      items: t.Boolean(),
      payments: t.Boolean(),
      note: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      isDeleting: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const purchaseOrderInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      discountType: t.Boolean(),
      serviceProvider: t.Boolean(),
      items: t.Boolean(),
      payments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const purchaseOrderOrderBy = t.Partial(
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
      serviceProviderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const purchaseOrder = t.Composite(
  [purchaseOrderPlain, purchaseOrderRelations],
  { additionalProperties: false },
);

export const purchaseOrderInputCreate = t.Composite(
  [purchaseOrderPlainInputCreate, purchaseOrderRelationsInputCreate],
  { additionalProperties: false },
);

export const purchaseOrderInputUpdate = t.Composite(
  [purchaseOrderPlainInputUpdate, purchaseOrderRelationsInputUpdate],
  { additionalProperties: false },
);
