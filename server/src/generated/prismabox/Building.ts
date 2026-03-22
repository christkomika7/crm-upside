import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BuildingPlain = t.Object(
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
);

export const BuildingRelations = t.Object(
  {
    lotTypes: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    units: t.Array(
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
      { additionalProperties: false },
    ),
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

export const BuildingPlainInputCreate = t.Object(
  {
    reference: t.String(),
    name: t.String(),
    location: t.String(),
    constructionDate: t.Date(),
    door: t.Integer(),
    parkingPrice: t.Optional(t.Number()),
    security: t.Optional(t.Boolean()),
    camera: t.Optional(t.Boolean()),
    elevator: t.Optional(t.Boolean()),
    parking: t.Optional(t.Boolean()),
    pool: t.Optional(t.Boolean()),
    generator: t.Optional(t.Boolean()),
    waterBorehole: t.Optional(t.Boolean()),
    gym: t.Optional(t.Boolean()),
    garden: t.Optional(t.Boolean()),
    status: t.Array(t.String(), { additionalProperties: false }),
    map: t.String(),
    photos: t.Array(t.String(), { additionalProperties: false }),
    deeds: t.Array(t.String(), { additionalProperties: false }),
    documents: t.Array(t.String(), { additionalProperties: false }),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const BuildingPlainInputUpdate = t.Object(
  {
    reference: t.Optional(t.String()),
    name: t.Optional(t.String()),
    location: t.Optional(t.String()),
    constructionDate: t.Optional(t.Date()),
    door: t.Optional(t.Integer()),
    parkingPrice: t.Optional(t.Number()),
    security: t.Optional(t.Boolean()),
    camera: t.Optional(t.Boolean()),
    elevator: t.Optional(t.Boolean()),
    parking: t.Optional(t.Boolean()),
    pool: t.Optional(t.Boolean()),
    generator: t.Optional(t.Boolean()),
    waterBorehole: t.Optional(t.Boolean()),
    gym: t.Optional(t.Boolean()),
    garden: t.Optional(t.Boolean()),
    status: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    map: t.Optional(t.String()),
    photos: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    deeds: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    documents: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const BuildingRelationsInputCreate = t.Object(
  {
    lotTypes: t.Optional(
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
    units: t.Optional(
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

export const BuildingRelationsInputUpdate = t.Partial(
  t.Object(
    {
      lotTypes: t.Partial(
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
      units: t.Partial(
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

export const BuildingWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          ownerId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Building" },
  ),
);

export const BuildingWhereUnique = t.Recursive(
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
              ownerId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Building" },
);

export const BuildingSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reference: t.Boolean(),
      name: t.Boolean(),
      location: t.Boolean(),
      constructionDate: t.Boolean(),
      door: t.Boolean(),
      parkingPrice: t.Boolean(),
      security: t.Boolean(),
      camera: t.Boolean(),
      elevator: t.Boolean(),
      parking: t.Boolean(),
      pool: t.Boolean(),
      generator: t.Boolean(),
      waterBorehole: t.Boolean(),
      gym: t.Boolean(),
      garden: t.Boolean(),
      status: t.Boolean(),
      map: t.Boolean(),
      photos: t.Boolean(),
      deeds: t.Boolean(),
      documents: t.Boolean(),
      isDeleting: t.Boolean(),
      lotTypes: t.Boolean(),
      units: t.Boolean(),
      ownerId: t.Boolean(),
      owner: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      propertyManagements: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BuildingInclude = t.Partial(
  t.Object(
    {
      lotTypes: t.Boolean(),
      units: t.Boolean(),
      owner: t.Boolean(),
      propertyManagements: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BuildingOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      location: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      constructionDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      door: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parkingPrice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      security: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      camera: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      elevator: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parking: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pool: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      generator: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      waterBorehole: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gym: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      garden: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      status: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      map: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      photos: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deeds: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documents: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Building = t.Composite([BuildingPlain, BuildingRelations], {
  additionalProperties: false,
});

export const BuildingInputCreate = t.Composite(
  [BuildingPlainInputCreate, BuildingRelationsInputCreate],
  { additionalProperties: false },
);

export const BuildingInputUpdate = t.Composite(
  [BuildingPlainInputUpdate, BuildingRelationsInputUpdate],
  { additionalProperties: false },
);
