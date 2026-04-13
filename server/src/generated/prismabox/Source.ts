import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SourcePlain = t.Object(
  {
    id: t.String(),
    type: t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
      additionalProperties: false,
    }),
    name: t.String(),
  },
  { additionalProperties: false },
);

export const SourceRelations = t.Object(
  {
    accountings: t.Array(
      t.Object(
        {
          id: t.String(),
          date: t.Date(),
          type: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
            additionalProperties: false,
          }),
          paymentMode: t.Union(
            [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          isTTC: t.Boolean(),
          checkNumber: t.String(),
          description: t.String(),
          clientType: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          ownerId: __nullable__(t.String()),
          tenantId: __nullable__(t.String()),
          invoiceId: __nullable__(t.String()),
          purchaseOrderId: __nullable__(t.String()),
          unitId: t.String(),
          sourceId: t.String(),
          allocationId: t.String(),
          categoryId: t.String(),
          natureId: t.String(),
          secondNatureId: t.String(),
          thirdNatureId: t.String(),
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

export const SourcePlainInputCreate = t.Object(
  {
    type: t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
      additionalProperties: false,
    }),
    name: t.String(),
  },
  { additionalProperties: false },
);

export const SourcePlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
        additionalProperties: false,
      }),
    ),
    name: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const SourceRelationsInputCreate = t.Object(
  {
    accountings: t.Optional(
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

export const SourceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      accountings: t.Partial(
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

export const SourceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          type: t.Union(
            [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
            { additionalProperties: false },
          ),
          name: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Source" },
  ),
);

export const SourceWhereUnique = t.Recursive(
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
              type: t.Union(
                [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
                { additionalProperties: false },
              ),
              name: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Source" },
);

export const SourceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      type: t.Boolean(),
      name: t.Boolean(),
      accountings: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SourceInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), accountings: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SourceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Source = t.Composite([SourcePlain, SourceRelations], {
  additionalProperties: false,
});

export const SourceInputCreate = t.Composite(
  [SourcePlainInputCreate, SourceRelationsInputCreate],
  { additionalProperties: false },
);

export const SourceInputUpdate = t.Composite(
  [SourcePlainInputUpdate, SourceRelationsInputUpdate],
  { additionalProperties: false },
);
