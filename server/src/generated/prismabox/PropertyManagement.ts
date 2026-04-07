import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PropertyManagementPlain = t.Object(
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
);

export const PropertyManagementRelations = t.Object(
  {
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
    unit: t.Object(
      {
        id: t.String(),
        reference: t.String(),
        rentalStatus: t.String(),
        surface: t.Number(),
        rooms: t.Integer(),
        dining: t.Integer(),
        kitchen: t.Integer(),
        bedroom: t.Integer(),
        bathroom: t.Integer(),
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
    services: t.Array(
      t.Object(
        { id: t.String(), name: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PropertyManagementPlainInputCreate = t.Object(
  {
    administrativeManagement: t.Optional(t.Boolean()),
    technicalManagement: t.Optional(t.Boolean()),
    start: t.Date(),
    end: t.Date(),
    observations: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PropertyManagementPlainInputUpdate = t.Object(
  {
    administrativeManagement: t.Optional(t.Boolean()),
    technicalManagement: t.Optional(t.Boolean()),
    start: t.Optional(t.Date()),
    end: t.Optional(t.Date()),
    observations: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PropertyManagementRelationsInputCreate = t.Object(
  {
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
    services: t.Optional(
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

export const PropertyManagementRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      services: t.Partial(
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

export const PropertyManagementWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          buildingId: t.String(),
          unitId: t.String(),
          administrativeManagement: t.Boolean(),
          technicalManagement: t.Boolean(),
          start: t.Date(),
          end: t.Date(),
          observations: t.String(),
          active: t.Boolean(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PropertyManagement" },
  ),
);

export const PropertyManagementWhereUnique = t.Recursive(
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
              buildingId: t.String(),
              unitId: t.String(),
              administrativeManagement: t.Boolean(),
              technicalManagement: t.Boolean(),
              start: t.Date(),
              end: t.Date(),
              observations: t.String(),
              active: t.Boolean(),
              isDeleting: t.Boolean(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PropertyManagement" },
);

export const PropertyManagementSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      buildingId: t.Boolean(),
      building: t.Boolean(),
      unitId: t.Boolean(),
      unit: t.Boolean(),
      administrativeManagement: t.Boolean(),
      technicalManagement: t.Boolean(),
      services: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      observations: t.Boolean(),
      active: t.Boolean(),
      isDeleting: t.Boolean(),
      createdAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PropertyManagementInclude = t.Partial(
  t.Object(
    {
      building: t.Boolean(),
      unit: t.Boolean(),
      services: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PropertyManagementOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      buildingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      administrativeManagement: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      technicalManagement: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      start: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      end: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      observations: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PropertyManagement = t.Composite(
  [PropertyManagementPlain, PropertyManagementRelations],
  { additionalProperties: false },
);

export const PropertyManagementInputCreate = t.Composite(
  [PropertyManagementPlainInputCreate, PropertyManagementRelationsInputCreate],
  { additionalProperties: false },
);

export const PropertyManagementInputUpdate = t.Composite(
  [PropertyManagementPlainInputUpdate, PropertyManagementRelationsInputUpdate],
  { additionalProperties: false },
);
