import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DeletionPlain = t.Object(
  {
    id: t.String(),
    type: t.Union(
      [
        t.Literal("ACCOUNTING"),
        t.Literal("OWNER"),
        t.Literal("BUILDING"),
        t.Literal("TENANT"),
        t.Literal("UNIT"),
        t.Literal("RENTAL"),
        t.Literal("RESERVATION"),
        t.Literal("PROPERTY_MANAGEMENT"),
        t.Literal("PRODUCT_SERVICE"),
        t.Literal("INVOICING"),
        t.Literal("QUOTE"),
        t.Literal("PURCHASE_ORDER"),
        t.Literal("CONTRACT"),
        t.Literal("CHECK_IN"),
        t.Literal("APPOINTMENT"),
        t.Literal("SERVICE_PROVIDER"),
        t.Literal("COMMUNICATION"),
      ],
      { additionalProperties: false },
    ),
    recordId: t.String(),
    state: t.Union(
      [t.Literal("NOTHING"), t.Literal("WAIT"), t.Literal("TERMINED")],
      { additionalProperties: false },
    ),
    userId: t.String(),
    updatedAt: t.Date(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DeletionRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String(),
        email: t.String(),
        createdAt: t.Date(),
        firstname: t.String(),
        lastname: t.String(),
        name: t.String(),
        role: t.Union([t.Literal("ADMIN"), t.Literal("USER")], {
          additionalProperties: false,
        }),
        emailVerified: t.Boolean(),
        image: __nullable__(t.String()),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const DeletionPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("ACCOUNTING"),
        t.Literal("OWNER"),
        t.Literal("BUILDING"),
        t.Literal("TENANT"),
        t.Literal("UNIT"),
        t.Literal("RENTAL"),
        t.Literal("RESERVATION"),
        t.Literal("PROPERTY_MANAGEMENT"),
        t.Literal("PRODUCT_SERVICE"),
        t.Literal("INVOICING"),
        t.Literal("QUOTE"),
        t.Literal("PURCHASE_ORDER"),
        t.Literal("CONTRACT"),
        t.Literal("CHECK_IN"),
        t.Literal("APPOINTMENT"),
        t.Literal("SERVICE_PROVIDER"),
        t.Literal("COMMUNICATION"),
      ],
      { additionalProperties: false },
    ),
    state: t.Optional(
      t.Union(
        [t.Literal("NOTHING"), t.Literal("WAIT"), t.Literal("TERMINED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const DeletionPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("ACCOUNTING"),
          t.Literal("OWNER"),
          t.Literal("BUILDING"),
          t.Literal("TENANT"),
          t.Literal("UNIT"),
          t.Literal("RENTAL"),
          t.Literal("RESERVATION"),
          t.Literal("PROPERTY_MANAGEMENT"),
          t.Literal("PRODUCT_SERVICE"),
          t.Literal("INVOICING"),
          t.Literal("QUOTE"),
          t.Literal("PURCHASE_ORDER"),
          t.Literal("CONTRACT"),
          t.Literal("CHECK_IN"),
          t.Literal("APPOINTMENT"),
          t.Literal("SERVICE_PROVIDER"),
          t.Literal("COMMUNICATION"),
        ],
        { additionalProperties: false },
      ),
    ),
    state: t.Optional(
      t.Union(
        [t.Literal("NOTHING"), t.Literal("WAIT"), t.Literal("TERMINED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const DeletionRelationsInputCreate = t.Object(
  {
    user: t.Object(
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
  },
  { additionalProperties: false },
);

export const DeletionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const DeletionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          type: t.Union(
            [
              t.Literal("ACCOUNTING"),
              t.Literal("OWNER"),
              t.Literal("BUILDING"),
              t.Literal("TENANT"),
              t.Literal("UNIT"),
              t.Literal("RENTAL"),
              t.Literal("RESERVATION"),
              t.Literal("PROPERTY_MANAGEMENT"),
              t.Literal("PRODUCT_SERVICE"),
              t.Literal("INVOICING"),
              t.Literal("QUOTE"),
              t.Literal("PURCHASE_ORDER"),
              t.Literal("CONTRACT"),
              t.Literal("CHECK_IN"),
              t.Literal("APPOINTMENT"),
              t.Literal("SERVICE_PROVIDER"),
              t.Literal("COMMUNICATION"),
            ],
            { additionalProperties: false },
          ),
          recordId: t.String(),
          state: t.Union(
            [t.Literal("NOTHING"), t.Literal("WAIT"), t.Literal("TERMINED")],
            { additionalProperties: false },
          ),
          userId: t.String(),
          updatedAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Deletion" },
  ),
);

export const DeletionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), recordId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ recordId: t.String() })],
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
              type: t.Union(
                [
                  t.Literal("ACCOUNTING"),
                  t.Literal("OWNER"),
                  t.Literal("BUILDING"),
                  t.Literal("TENANT"),
                  t.Literal("UNIT"),
                  t.Literal("RENTAL"),
                  t.Literal("RESERVATION"),
                  t.Literal("PROPERTY_MANAGEMENT"),
                  t.Literal("PRODUCT_SERVICE"),
                  t.Literal("INVOICING"),
                  t.Literal("QUOTE"),
                  t.Literal("PURCHASE_ORDER"),
                  t.Literal("CONTRACT"),
                  t.Literal("CHECK_IN"),
                  t.Literal("APPOINTMENT"),
                  t.Literal("SERVICE_PROVIDER"),
                  t.Literal("COMMUNICATION"),
                ],
                { additionalProperties: false },
              ),
              recordId: t.String(),
              state: t.Union(
                [
                  t.Literal("NOTHING"),
                  t.Literal("WAIT"),
                  t.Literal("TERMINED"),
                ],
                { additionalProperties: false },
              ),
              userId: t.String(),
              updatedAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Deletion" },
);

export const DeletionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      type: t.Boolean(),
      recordId: t.Boolean(),
      state: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      updatedAt: t.Boolean(),
      createdAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DeletionInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      state: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DeletionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Deletion = t.Composite([DeletionPlain, DeletionRelations], {
  additionalProperties: false,
});

export const DeletionInputCreate = t.Composite(
  [DeletionPlainInputCreate, DeletionRelationsInputCreate],
  { additionalProperties: false },
);

export const DeletionInputUpdate = t.Composite(
  [DeletionPlainInputUpdate, DeletionRelationsInputUpdate],
  { additionalProperties: false },
);
