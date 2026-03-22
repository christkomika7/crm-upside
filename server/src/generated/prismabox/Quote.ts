import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuotePlain = t.Object(
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
);

export const QuoteRelations = t.Object(
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
          firstname: t.String(),
          lastname: t.String(),
          company: t.String(),
          phone: t.String(),
          email: t.String(),
          address: t.String(),
          maritalStatus: __nullable__(t.String()),
          income: t.Number(),
          bankInfo: t.String(),
          paymentMode: t.String(),
          documents: t.Array(t.String(), { additionalProperties: false }),
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
          quantity: __nullable__(t.Integer()),
          productServiceId: t.String(),
          price: t.Number(),
          invoiceId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          quoteId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const QuotePlainInputCreate = t.Object(
  {
    reference: t.String(),
    price: t.Optional(t.Number()),
    discount: t.Optional(t.Number()),
    discountType: t.Optional(
      t.Union([t.Literal("PURCENT"), t.Literal("MONEY")], {
        additionalProperties: false,
      }),
    ),
    hasTax: t.Optional(t.Boolean()),
    updatedTax: t.Optional(__nullable__(t.String())),
    type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
      additionalProperties: false,
    }),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const QuotePlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.String()),
    price: t.Optional(t.Number()),
    discount: t.Optional(t.Number()),
    discountType: t.Optional(
      t.Union([t.Literal("PURCENT"), t.Literal("MONEY")], {
        additionalProperties: false,
      }),
    ),
    hasTax: t.Optional(t.Boolean()),
    updatedTax: t.Optional(__nullable__(t.String())),
    type: t.Optional(
      t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
        additionalProperties: false,
      }),
    ),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const QuoteRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const QuoteRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const QuoteWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          reference: t.String(),
          price: t.Number(),
          discount: t.Number(),
          discountType: t.Union([t.Literal("PURCENT"), t.Literal("MONEY")], {
            additionalProperties: false,
          }),
          hasTax: t.Boolean(),
          updatedTax: t.String(),
          type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          ownerId: t.String(),
          tenantId: t.String(),
          note: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Quote" },
  ),
);

export const QuoteWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), reference: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ reference: t.String() })],
          { additionalProperties: false },
        ),
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
              reference: t.String(),
              price: t.Number(),
              discount: t.Number(),
              discountType: t.Union(
                [t.Literal("PURCENT"), t.Literal("MONEY")],
                { additionalProperties: false },
              ),
              hasTax: t.Boolean(),
              updatedTax: t.String(),
              type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
                additionalProperties: false,
              }),
              ownerId: t.String(),
              tenantId: t.String(),
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
  { $id: "Quote" },
);

export const QuoteSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      price: t.Boolean(),
      discount: t.Boolean(),
      discountType: t.Boolean(),
      hasTax: t.Boolean(),
      updatedTax: t.Boolean(),
      type: t.Boolean(),
      ownerId: t.Boolean(),
      owner: t.Boolean(),
      tenantId: t.Boolean(),
      tenant: t.Boolean(),
      items: t.Boolean(),
      note: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuoteInclude = t.Partial(
  t.Object(
    {
      discountType: t.Boolean(),
      type: t.Boolean(),
      owner: t.Boolean(),
      tenant: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const QuoteOrderBy = t.Partial(
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
      discount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hasTax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedTax: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Quote = t.Composite([QuotePlain, QuoteRelations], {
  additionalProperties: false,
});

export const QuoteInputCreate = t.Composite(
  [QuotePlainInputCreate, QuoteRelationsInputCreate],
  { additionalProperties: false },
);

export const QuoteInputUpdate = t.Composite(
  [QuotePlainInputUpdate, QuoteRelationsInputUpdate],
  { additionalProperties: false },
);
