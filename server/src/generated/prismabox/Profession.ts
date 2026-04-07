import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProfessionPlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ProfessionRelations = t.Object(
  {
    serviceProviders: t.Array(
      t.Object(
        {
          id: t.String(),
          firstname: t.String(),
          lastname: t.String(),
          company: t.String(),
          phone: t.String(),
          email: t.String(),
          address: t.String(),
          nif: t.String(),
          registerNumber: t.String(),
          paymentMode: t.Union(
            [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
            { additionalProperties: false },
          ),
          note: t.Number(),
          comment: __nullable__(t.String()),
          isDeleting: t.Boolean(),
          professionId: t.String(),
          rcc: __nullable__(t.String()),
          idCard: __nullable__(t.String()),
          taxCertificate: __nullable__(t.String()),
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

export const ProfessionPlainInputCreate = t.Object(
  { name: t.String() },
  { additionalProperties: false },
);

export const ProfessionPlainInputUpdate = t.Object(
  { name: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const ProfessionRelationsInputCreate = t.Object(
  {
    serviceProviders: t.Optional(
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

export const ProfessionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      serviceProviders: t.Partial(
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

export const ProfessionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Profession" },
  ),
);

export const ProfessionWhereUnique = t.Recursive(
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
            {
              id: t.String(),
              name: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Profession" },
);

export const ProfessionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      serviceProviders: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProfessionInclude = t.Partial(
  t.Object(
    { serviceProviders: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ProfessionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Profession = t.Composite([ProfessionPlain, ProfessionRelations], {
  additionalProperties: false,
});

export const ProfessionInputCreate = t.Composite(
  [ProfessionPlainInputCreate, ProfessionRelationsInputCreate],
  { additionalProperties: false },
);

export const ProfessionInputUpdate = t.Composite(
  [ProfessionPlainInputUpdate, ProfessionRelationsInputUpdate],
  { additionalProperties: false },
);
