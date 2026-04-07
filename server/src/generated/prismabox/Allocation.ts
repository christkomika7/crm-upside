import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AllocationPlain = t.Object(
  { id: t.String(), name: t.String() },
  { additionalProperties: false },
);

export const AllocationRelations = t.Object(
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

export const AllocationPlainInputCreate = t.Object(
  { name: t.String() },
  { additionalProperties: false },
);

export const AllocationPlainInputUpdate = t.Object(
  { name: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const AllocationRelationsInputCreate = t.Object(
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

export const AllocationRelationsInputUpdate = t.Partial(
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

export const AllocationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Allocation" },
  ),
);

export const AllocationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), name: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ name: t.String() })],
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
            { id: t.String(), name: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Allocation" },
);

export const AllocationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      accountings: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AllocationInclude = t.Partial(
  t.Object(
    { accountings: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AllocationOrderBy = t.Partial(
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

export const Allocation = t.Composite([AllocationPlain, AllocationRelations], {
  additionalProperties: false,
});

export const AllocationInputCreate = t.Composite(
  [AllocationPlainInputCreate, AllocationRelationsInputCreate],
  { additionalProperties: false },
);

export const AllocationInputUpdate = t.Composite(
  [AllocationPlainInputUpdate, AllocationRelationsInputUpdate],
  { additionalProperties: false },
);
