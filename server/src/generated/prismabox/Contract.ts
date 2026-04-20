import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ContractPlain = t.Object(
  {
    id: t.String(),
    type: t.Union([t.Literal("CONTRACT"), t.Literal("MANDATE")], {
      additionalProperties: false,
    }),
    start: t.Date(),
    end: t.Date(),
    rentalId: __nullable__(t.String()),
    buildingId: __nullable__(t.String()),
    isCanceled: t.Boolean(),
    isDeleting: t.Boolean(),
    updatedAt: t.Date(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ContractRelations = t.Object(
  {
    rental: __nullable__(
      t.Object(
        {
          id: t.String(),
          tenantId: t.String(),
          unitId: t.String(),
          isDeleting: t.Boolean(),
          price: t.Number(),
          start: t.Date(),
          end: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    building: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.String(),
          name: t.String(),
          location: t.String(),
          constructionDate: t.Date(),
          security: t.Boolean(),
          camera: t.Boolean(),
          elevator: t.Boolean(),
          parking: t.Boolean(),
          pool: t.Boolean(),
          generator: t.Boolean(),
          waterBorehole: t.Boolean(),
          gym: t.Boolean(),
          garden: t.Boolean(),
          status: t.Array(t.String(), { additionalProperties: false }),
          map: t.String(),
          photos: t.Array(t.String(), { additionalProperties: false }),
          deeds: t.Array(t.String(), { additionalProperties: false }),
          documents: t.Array(t.String(), { additionalProperties: false }),
          isDeleting: t.Boolean(),
          ownerId: __nullable__(t.String()),
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

export const ContractPlainInputCreate = t.Object(
  {
    type: t.Union([t.Literal("CONTRACT"), t.Literal("MANDATE")], {
      additionalProperties: false,
    }),
    start: t.Date(),
    end: t.Date(),
    isCanceled: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ContractPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("CONTRACT"), t.Literal("MANDATE")], {
        additionalProperties: false,
      }),
    ),
    start: t.Optional(t.Date()),
    end: t.Optional(t.Date()),
    isCanceled: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ContractRelationsInputCreate = t.Object(
  {
    rental: t.Optional(
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
    building: t.Optional(
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

export const ContractRelationsInputUpdate = t.Partial(
  t.Object(
    {
      rental: t.Partial(
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
      building: t.Partial(
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

export const ContractWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          type: t.Union([t.Literal("CONTRACT"), t.Literal("MANDATE")], {
            additionalProperties: false,
          }),
          start: t.Date(),
          end: t.Date(),
          rentalId: t.String(),
          buildingId: t.String(),
          isCanceled: t.Boolean(),
          isDeleting: t.Boolean(),
          updatedAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Contract" },
  ),
);

export const ContractWhereUnique = t.Recursive(
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
              type: t.Union([t.Literal("CONTRACT"), t.Literal("MANDATE")], {
                additionalProperties: false,
              }),
              start: t.Date(),
              end: t.Date(),
              rentalId: t.String(),
              buildingId: t.String(),
              isCanceled: t.Boolean(),
              isDeleting: t.Boolean(),
              updatedAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Contract" },
);

export const ContractSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      type: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      rentalId: t.Boolean(),
      rental: t.Boolean(),
      buildingId: t.Boolean(),
      building: t.Boolean(),
      isCanceled: t.Boolean(),
      isDeleting: t.Boolean(),
      updatedAt: t.Boolean(),
      createdAt: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ContractInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      rental: t.Boolean(),
      building: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ContractOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      end: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rentalId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      buildingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isCanceled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Contract = t.Composite([ContractPlain, ContractRelations], {
  additionalProperties: false,
});

export const ContractInputCreate = t.Composite(
  [ContractPlainInputCreate, ContractRelationsInputCreate],
  { additionalProperties: false },
);

export const ContractInputUpdate = t.Composite(
  [ContractPlainInputUpdate, ContractRelationsInputUpdate],
  { additionalProperties: false },
);
