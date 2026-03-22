import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UnitPlain = t.Object(
  {
    id: t.String(),
    reference: t.String(),
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
);

export const UnitRelations = t.Object(
  {
    rentals: t.Array(
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
      { additionalProperties: false },
    ),
    building: t.Object(
      {
        id: t.String(),
        reference: t.String(),
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
        ownerId: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    type: t.Object(
      {
        id: t.String(),
        name: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    reservations: t.Array(
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
      { additionalProperties: false },
    ),
    propertyManagements: t.Array(
      t.Object(
        {
          id: t.String(),
          buildingId: t.String(),
          unitId: t.String(),
          administrativeManagement: t.Boolean(),
          technicalManagement: t.Boolean(),
          start: t.Date(),
          end: t.Date(),
          observations: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UnitPlainInputCreate = t.Object(
  {
    reference: t.String(),
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
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const UnitPlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.String()),
    rentalStatus: t.Optional(t.String()),
    surface: t.Optional(t.String()),
    rooms: t.Optional(t.String()),
    rent: t.Optional(t.Number()),
    furnished: t.Optional(t.String()),
    wifi: t.Optional(t.Boolean()),
    water: t.Optional(t.Boolean()),
    electricity: t.Optional(t.Boolean()),
    tv: t.Optional(t.Boolean()),
    charges: t.Optional(t.Number()),
    documents: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const UnitRelationsInputCreate = t.Object(
  {
    rentals: t.Optional(
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
    type: t.Object(
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
    reservations: t.Optional(
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
    propertyManagements: t.Optional(
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

export const UnitRelationsInputUpdate = t.Partial(
  t.Object(
    {
      rentals: t.Partial(
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
      type: t.Object(
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
      reservations: t.Partial(
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
      propertyManagements: t.Partial(
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

export const UnitWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          reference: t.String(),
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
    { $id: "Unit" },
  ),
);

export const UnitWhereUnique = t.Recursive(
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Unit" },
);

export const UnitSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      rentalStatus: t.Boolean(),
      surface: t.Boolean(),
      rooms: t.Boolean(),
      rent: t.Boolean(),
      furnished: t.Boolean(),
      wifi: t.Boolean(),
      water: t.Boolean(),
      electricity: t.Boolean(),
      tv: t.Boolean(),
      charges: t.Boolean(),
      documents: t.Boolean(),
      isDeleting: t.Boolean(),
      rentals: t.Boolean(),
      building: t.Boolean(),
      buildingId: t.Boolean(),
      typeId: t.Boolean(),
      type: t.Boolean(),
      reservations: t.Boolean(),
      propertyManagements: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UnitInclude = t.Partial(
  t.Object(
    {
      rentals: t.Boolean(),
      building: t.Boolean(),
      type: t.Boolean(),
      reservations: t.Boolean(),
      propertyManagements: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UnitOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rentalStatus: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      surface: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rooms: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      furnished: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      wifi: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      water: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      electricity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tv: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      charges: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documents: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      buildingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      typeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Unit = t.Composite([UnitPlain, UnitRelations], {
  additionalProperties: false,
});

export const UnitInputCreate = t.Composite(
  [UnitPlainInputCreate, UnitRelationsInputCreate],
  { additionalProperties: false },
);

export const UnitInputUpdate = t.Composite(
  [UnitPlainInputUpdate, UnitRelationsInputUpdate],
  { additionalProperties: false },
);
