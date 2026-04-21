import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PersonalServicePlain = t.Object(
  { id: t.String(), name: t.String() },
  { additionalProperties: false },
);

export const PersonalServiceRelations = t.Object(
  {
    propertyManagements: t.Array(
      t.Object(
        {
          id: t.String(),
          buildingId: t.String(),
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

export const PersonalServicePlainInputCreate = t.Object(
  { name: t.String() },
  { additionalProperties: false },
);

export const PersonalServicePlainInputUpdate = t.Object(
  { name: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const PersonalServiceRelationsInputCreate = t.Object(
  {
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

export const PersonalServiceRelationsInputUpdate = t.Partial(
  t.Object(
    {
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

export const PersonalServiceWhere = t.Partial(
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
    { $id: "PersonalService" },
  ),
);

export const PersonalServiceWhereUnique = t.Recursive(
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
  { $id: "PersonalService" },
);

export const PersonalServiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      propertyManagements: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PersonalServiceInclude = t.Partial(
  t.Object(
    { propertyManagements: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PersonalServiceOrderBy = t.Partial(
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

export const PersonalService = t.Composite(
  [PersonalServicePlain, PersonalServiceRelations],
  { additionalProperties: false },
);

export const PersonalServiceInputCreate = t.Composite(
  [PersonalServicePlainInputCreate, PersonalServiceRelationsInputCreate],
  { additionalProperties: false },
);

export const PersonalServiceInputUpdate = t.Composite(
  [PersonalServicePlainInputUpdate, PersonalServiceRelationsInputUpdate],
  { additionalProperties: false },
);
