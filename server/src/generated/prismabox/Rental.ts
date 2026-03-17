import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RentalPlain = t.Object(
  {
    id: t.String(),
    reference: t.Integer(),
    tenantId: t.String(),
    buildingId: t.String(),
    unitId: t.String(),
    isDeleting: t.Boolean(),
    price: t.Number(),
    start: t.Date(),
    end: t.Date(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RentalRelations = t.Object(
  {
    tenant: t.Object(
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
    building: t.Object(
      {
        id: t.String(),
        reference: t.Integer(),
        name: t.String(),
        location: t.String(),
        constructionDate: t.Date(),
        door: t.Integer(),
        parkingPrice: t.Number(),
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
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    unit: t.Object(
      {
        id: t.String(),
        reference: t.Integer(),
        rentalStatus: t.String(),
        surface: t.String(),
        rooms: t.String(),
        rent: t.Number(),
        furnished: t.String(),
        wifi: t.Boolean(),
        water: t.Boolean(),
        electricity: t.Boolean(),
        tv: t.Boolean(),
        charges: t.Number(),
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

export const RentalPlainInputCreate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    isDeleting: t.Optional(t.Boolean()),
    price: t.Optional(t.Number()),
    start: t.Date(),
    end: t.Date(),
  },
  { additionalProperties: false },
);

export const RentalPlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.Integer()),
    isDeleting: t.Optional(t.Boolean()),
    price: t.Optional(t.Number()),
    start: t.Optional(t.Date()),
    end: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const RentalRelationsInputCreate = t.Object(
  {
    tenant: t.Object(
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
    building: t.Object(
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

export const RentalRelationsInputUpdate = t.Partial(
  t.Object(
    {
      tenant: t.Object(
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
      building: t.Object(
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

export const RentalWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          reference: t.Integer(),
          tenantId: t.String(),
          buildingId: t.String(),
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
    { $id: "Rental" },
  ),
);

export const RentalWhereUnique = t.Recursive(
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
              tenantId: t.String(),
              buildingId: t.String(),
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
      ],
      { additionalProperties: false },
    ),
  { $id: "Rental" },
);

export const RentalSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      tenantId: t.Boolean(),
      tenant: t.Boolean(),
      buildingId: t.Boolean(),
      building: t.Boolean(),
      unitId: t.Boolean(),
      unit: t.Boolean(),
      isDeleting: t.Boolean(),
      price: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RentalInclude = t.Partial(
  t.Object(
    {
      tenant: t.Boolean(),
      building: t.Boolean(),
      unit: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RentalOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tenantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      buildingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      end: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Rental = t.Composite([RentalPlain, RentalRelations], {
  additionalProperties: false,
});

export const RentalInputCreate = t.Composite(
  [RentalPlainInputCreate, RentalRelationsInputCreate],
  { additionalProperties: false },
);

export const RentalInputUpdate = t.Composite(
  [RentalPlainInputUpdate, RentalRelationsInputUpdate],
  { additionalProperties: false },
);
