import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProductServicePlain = t.Object(
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
);

export const ProductServiceRelations = t.Object(
  {
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
  },
  { additionalProperties: false },
);

export const ProductServicePlainInputCreate = t.Object(
  {
    reference: t.String(),
    description: t.String(),
    hasTax: t.Optional(t.Boolean()),
    price: t.Optional(t.Number()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ProductServicePlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.String()),
    description: t.Optional(t.String()),
    hasTax: t.Optional(t.Boolean()),
    price: t.Optional(t.Number()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ProductServiceRelationsInputCreate = t.Object(
  {
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

export const ProductServiceRelationsInputUpdate = t.Partial(
  t.Object(
    {
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

export const ProductServiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
    { $id: "ProductService" },
  ),
);

export const ProductServiceWhereUnique = t.Recursive(
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
      ],
      { additionalProperties: false },
    ),
  { $id: "ProductService" },
);

export const ProductServiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      description: t.Boolean(),
      hasTax: t.Boolean(),
      price: t.Boolean(),
      isDeleting: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProductServiceInclude = t.Partial(
  t.Object(
    { items: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ProductServiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hasTax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ProductService = t.Composite(
  [ProductServicePlain, ProductServiceRelations],
  { additionalProperties: false },
);

export const ProductServiceInputCreate = t.Composite(
  [ProductServicePlainInputCreate, ProductServiceRelationsInputCreate],
  { additionalProperties: false },
);

export const ProductServiceInputUpdate = t.Composite(
  [ProductServicePlainInputUpdate, ProductServiceRelationsInputUpdate],
  { additionalProperties: false },
);
