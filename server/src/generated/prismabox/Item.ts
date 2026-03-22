import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ItemPlain = t.Object(
  {
    id: t.String(),
    quantity: __nullable__(t.Integer()),
    productServiceId: t.String(),
    price: t.Number(),
    invoiceId: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    quoteId: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const ItemRelations = t.Object(
  {
    productService: t.Object(
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
    invoice: t.Object(
      {
        id: t.String(),
        reference: t.Integer(),
        price: t.Number(),
        discount: t.Number(),
        discountType: t.Union([t.Literal("PURCENT"), t.Literal("MONEY")], {
          additionalProperties: false,
        }),
        hasTax: t.Boolean(),
        updatedTax: __nullable__(t.String()),
        type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
          additionalProperties: false,
        }),
        ownerId: __nullable__(t.String()),
        tenantId: __nullable__(t.String()),
        note: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    quote: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.String(),
          price: t.Number(),
          discount: t.Number(),
          discountType: t.Union([t.Literal("PURCENT"), t.Literal("MONEY")], {
            additionalProperties: false,
          }),
          hasTax: t.Boolean(),
          updatedTax: __nullable__(t.String()),
          type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          ownerId: __nullable__(t.String()),
          tenantId: __nullable__(t.String()),
          note: __nullable__(t.String()),
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
    quantity: t.Optional(__nullable__(t.Integer())),
    price: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const ItemPlainInputUpdate = t.Object(
  {
    quantity: t.Optional(__nullable__(t.Integer())),
    price: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const ItemRelationsInputCreate = t.Object(
  {
    productService: t.Object(
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
    invoice: t.Object(
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
  },
  { additionalProperties: false },
);

export const ItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      productService: t.Object(
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
      invoice: t.Object(
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
          quantity: t.Integer(),
          productServiceId: t.String(),
          price: t.Number(),
          invoiceId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          quoteId: t.String(),
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
              quantity: t.Integer(),
              productServiceId: t.String(),
              price: t.Number(),
              invoiceId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              quoteId: t.String(),
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
      quantity: t.Boolean(),
      productServiceId: t.Boolean(),
      productService: t.Boolean(),
      price: t.Boolean(),
      invoiceId: t.Boolean(),
      invoice: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      quote: t.Boolean(),
      quoteId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ItemInclude = t.Partial(
  t.Object(
    {
      productService: t.Boolean(),
      invoice: t.Boolean(),
      quote: t.Boolean(),
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
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quoteId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
