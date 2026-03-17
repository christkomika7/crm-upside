import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PermissionPlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    permissions: t.Any(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PermissionRelations = t.Object(
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

export const PermissionPlainInputCreate = t.Object(
  { permissions: t.Any() },
  { additionalProperties: false },
);

export const PermissionPlainInputUpdate = t.Object(
  { permissions: t.Optional(t.Any()) },
  { additionalProperties: false },
);

export const PermissionRelationsInputCreate = t.Object(
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

export const PermissionRelationsInputUpdate = t.Partial(
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

export const PermissionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          permissions: t.Any(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Permission" },
  ),
);

export const PermissionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), userId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ userId: t.String() })],
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
              userId: t.String(),
              permissions: t.Any(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Permission" },
);

export const PermissionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      permissions: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PermissionInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PermissionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      permissions: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Permission = t.Composite([PermissionPlain, PermissionRelations], {
  additionalProperties: false,
});

export const PermissionInputCreate = t.Composite(
  [PermissionPlainInputCreate, PermissionRelationsInputCreate],
  { additionalProperties: false },
);

export const PermissionInputUpdate = t.Composite(
  [PermissionPlainInputUpdate, PermissionRelationsInputUpdate],
  { additionalProperties: false },
);
