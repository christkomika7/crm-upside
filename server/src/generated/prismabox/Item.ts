import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ItemPlain = t.Object(
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
);

export const ItemRelations = t.Object(
  {
    productService: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.String(),
          description: t.String(),
          hasTax: t.Boolean(),
          price: t.Number(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
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
          period: __nullable__(t.String()),
          note: __nullable__(t.String()),
          start: t.Date(),
          end: t.String(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    quote: __nullable__(
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
  },
  { additionalProperties: false },
);

export const ItemPlainInputCreate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("ITEM"), t.Literal("UNIT")], {
        additionalProperties: false,
      }),
    ),
    quantity: t.Integer(),
    price: t.Optional(t.Number()),
    charges: t.Optional(__nullable__(t.Number())),
    extraCharges: t.Optional(__nullable__(t.Number())),
    start: t.Optional(__nullable__(t.Date())),
    end: t.Optional(__nullable__(t.Date())),
    description: t.String(),
    reference: t.String(),
    hasTax: t.Optional(t.Boolean()),
    status: t.Optional(
      t.Union([t.Literal("USED"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const ItemPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("ITEM"), t.Literal("UNIT")], {
        additionalProperties: false,
      }),
    ),
    quantity: t.Optional(t.Integer()),
    price: t.Optional(t.Number()),
    charges: t.Optional(__nullable__(t.Number())),
    extraCharges: t.Optional(__nullable__(t.Number())),
    start: t.Optional(__nullable__(t.Date())),
    end: t.Optional(__nullable__(t.Date())),
    description: t.Optional(t.String()),
    reference: t.Optional(t.String()),
    hasTax: t.Optional(t.Boolean()),
    status: t.Optional(
      t.Union([t.Literal("USED"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const ItemRelationsInputCreate = t.Object(
  {
    productService: t.Optional(
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
    quote: t.Optional(
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
  },
  { additionalProperties: false },
);

export const ItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      productService: t.Partial(
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
      quote: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          type: t.Union([t.Literal("ITEM"), t.Literal("UNIT")], {
            additionalProperties: false,
          }),
          quantity: t.Integer(),
          productServiceId: t.String(),
          unitId: t.String(),
          price: t.Number(),
          charges: t.Number(),
          extraCharges: t.Number(),
          start: t.Date(),
          end: t.Date(),
          description: t.String(),
          reference: t.String(),
          hasTax: t.Boolean(),
          status: t.Union([t.Literal("USED"), t.Literal("IGNORE")], {
            additionalProperties: false,
          }),
          invoiceId: t.String(),
          quoteId: t.String(),
          purchaseOrderId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Item" },
  ),
);

export const ItemWhereUnique = t.Recursive(
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
              type: t.Union([t.Literal("ITEM"), t.Literal("UNIT")], {
                additionalProperties: false,
              }),
              quantity: t.Integer(),
              productServiceId: t.String(),
              unitId: t.String(),
              price: t.Number(),
              charges: t.Number(),
              extraCharges: t.Number(),
              start: t.Date(),
              end: t.Date(),
              description: t.String(),
              reference: t.String(),
              hasTax: t.Boolean(),
              status: t.Union([t.Literal("USED"), t.Literal("IGNORE")], {
                additionalProperties: false,
              }),
              invoiceId: t.String(),
              quoteId: t.String(),
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
  { $id: "Item" },
);

export const ItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      type: t.Boolean(),
      quantity: t.Boolean(),
      productServiceId: t.Boolean(),
      productService: t.Boolean(),
      unitId: t.Boolean(),
      unit: t.Boolean(),
      price: t.Boolean(),
      charges: t.Boolean(),
      extraCharges: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      description: t.Boolean(),
      reference: t.Boolean(),
      hasTax: t.Boolean(),
      status: t.Boolean(),
      invoiceId: t.Boolean(),
      invoice: t.Boolean(),
      quoteId: t.Boolean(),
      quote: t.Boolean(),
      purchaseOrder: t.Boolean(),
      purchaseOrderId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ItemInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      productService: t.Boolean(),
      unit: t.Boolean(),
      status: t.Boolean(),
      invoice: t.Boolean(),
      quote: t.Boolean(),
      purchaseOrder: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productServiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      charges: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      extraCharges: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      end: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hasTax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quoteId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Item = t.Composite([ItemPlain, ItemRelations], {
  additionalProperties: false,
});

export const ItemInputCreate = t.Composite(
  [ItemPlainInputCreate, ItemRelationsInputCreate],
  { additionalProperties: false },
);

export const ItemInputUpdate = t.Composite(
  [ItemPlainInputUpdate, ItemRelationsInputUpdate],
  { additionalProperties: false },
);
