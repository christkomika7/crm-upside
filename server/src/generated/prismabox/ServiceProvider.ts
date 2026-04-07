import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServiceProviderPlain = t.Object(
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
);

export const ServiceProviderRelations = t.Object(
  {
    profession: t.Object(
      {
        id: t.String(),
        name: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    purchaseOrders: t.Array(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          price: t.Number(),
          amountPaid: t.Number(),
          discount: t.Number(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("OVERDUE")],
            { additionalProperties: false },
          ),
          discountType: t.Union([t.Literal("PERCENT"), t.Literal("MONEY")], {
            additionalProperties: false,
          }),
          hasTax: t.Boolean(),
          serviceProviderId: t.String(),
          note: __nullable__(t.String()),
          start: t.Date(),
          end: t.Date(),
          isDeleting: t.Boolean(),
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

export const ServiceProviderPlainInputCreate = t.Object(
  {
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
    comment: t.Optional(__nullable__(t.String())),
    isDeleting: t.Optional(t.Boolean()),
    rcc: t.Optional(__nullable__(t.String())),
    idCard: t.Optional(__nullable__(t.String())),
    taxCertificate: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ServiceProviderPlainInputUpdate = t.Object(
  {
    firstname: t.Optional(t.String()),
    lastname: t.Optional(t.String()),
    company: t.Optional(t.String()),
    phone: t.Optional(t.String()),
    email: t.Optional(t.String()),
    address: t.Optional(t.String()),
    nif: t.Optional(t.String()),
    registerNumber: t.Optional(t.String()),
    paymentMode: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")], {
        additionalProperties: false,
      }),
    ),
    note: t.Optional(t.Number()),
    comment: t.Optional(__nullable__(t.String())),
    isDeleting: t.Optional(t.Boolean()),
    rcc: t.Optional(__nullable__(t.String())),
    idCard: t.Optional(__nullable__(t.String())),
    taxCertificate: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ServiceProviderRelationsInputCreate = t.Object(
  {
    profession: t.Object(
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
    purchaseOrders: t.Optional(
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

export const ServiceProviderRelationsInputUpdate = t.Partial(
  t.Object(
    {
      profession: t.Object(
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
      purchaseOrders: t.Partial(
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

export const ServiceProviderWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          comment: t.String(),
          isDeleting: t.Boolean(),
          professionId: t.String(),
          rcc: t.String(),
          idCard: t.String(),
          taxCertificate: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ServiceProvider" },
  ),
);

export const ServiceProviderWhereUnique = t.Recursive(
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
              comment: t.String(),
              isDeleting: t.Boolean(),
              professionId: t.String(),
              rcc: t.String(),
              idCard: t.String(),
              taxCertificate: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ServiceProvider" },
);

export const ServiceProviderSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      firstname: t.Boolean(),
      lastname: t.Boolean(),
      company: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      address: t.Boolean(),
      nif: t.Boolean(),
      registerNumber: t.Boolean(),
      paymentMode: t.Boolean(),
      note: t.Boolean(),
      comment: t.Boolean(),
      isDeleting: t.Boolean(),
      profession: t.Boolean(),
      professionId: t.Boolean(),
      rcc: t.Boolean(),
      idCard: t.Boolean(),
      taxCertificate: t.Boolean(),
      purchaseOrders: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceProviderInclude = t.Partial(
  t.Object(
    {
      paymentMode: t.Boolean(),
      profession: t.Boolean(),
      purchaseOrders: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceProviderOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      firstname: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastname: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      company: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nif: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      registerNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      comment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      professionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rcc: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idCard: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxCertificate: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ServiceProvider = t.Composite(
  [ServiceProviderPlain, ServiceProviderRelations],
  { additionalProperties: false },
);

export const ServiceProviderInputCreate = t.Composite(
  [ServiceProviderPlainInputCreate, ServiceProviderRelationsInputCreate],
  { additionalProperties: false },
);

export const ServiceProviderInputUpdate = t.Composite(
  [ServiceProviderPlainInputUpdate, ServiceProviderRelationsInputUpdate],
  { additionalProperties: false },
);
