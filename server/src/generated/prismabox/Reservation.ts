import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReservationPlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    contact: t.String(),
    start: t.Date(),
    end: t.Date(),
    price: t.Number(),
    isDeleting: t.Boolean(),
    unitId: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ReservationRelations = t.Object(
  {
    unit: t.Object(
      {
        id: t.String(),
        reference: t.String(),
        rentalStatus: t.String(),
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
        rent: t.Number(),
        charges: t.Number(),
        amountGenerate: t.Number(),
        documents: t.Array(t.String(), { additionalProperties: false }),
        isDeleting: t.Boolean(),
        buildingId: t.String(),
        typeId: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ReservationPlainInputCreate = t.Object(
  {
    name: t.String(),
    contact: t.String(),
    start: t.Date(),
    end: t.Date(),
    price: t.Optional(t.Number()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ReservationPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    contact: t.Optional(t.String()),
    start: t.Optional(t.Date()),
    end: t.Optional(t.Date()),
    price: t.Optional(t.Number()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ReservationRelationsInputCreate = t.Object(
  {
    unit: t.Object(
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

export const ReservationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      unit: t.Object(
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

export const ReservationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          contact: t.String(),
          start: t.Date(),
          end: t.Date(),
          price: t.Number(),
          isDeleting: t.Boolean(),
          unitId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Reservation" },
  ),
);

export const ReservationWhereUnique = t.Recursive(
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
              name: t.String(),
              contact: t.String(),
              start: t.Date(),
              end: t.Date(),
              price: t.Number(),
              isDeleting: t.Boolean(),
              unitId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Reservation" },
);

export const ReservationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      contact: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      price: t.Boolean(),
      isDeleting: t.Boolean(),
      unitId: t.Boolean(),
      unit: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ReservationInclude = t.Partial(
  t.Object(
    { unit: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ReservationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contact: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      end: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Reservation = t.Composite(
  [ReservationPlain, ReservationRelations],
  { additionalProperties: false },
);

export const ReservationInputCreate = t.Composite(
  [ReservationPlainInputCreate, ReservationRelationsInputCreate],
  { additionalProperties: false },
);

export const ReservationInputUpdate = t.Composite(
  [ReservationPlainInputUpdate, ReservationRelationsInputUpdate],
  { additionalProperties: false },
);
