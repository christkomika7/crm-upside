import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AppointmentPlain = t.Object(
  {
    id: t.String(),
    type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
      additionalProperties: false,
    }),
    ownerId: __nullable__(t.String()),
    tenantId: __nullable__(t.String()),
    date: t.Date(),
    hour: t.String(),
    minutes: t.String(),
    address: t.String(),
    subject: t.String(),
    note: t.String(),
    isComplete: t.Boolean(),
    isDeleting: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AppointmentRelations = t.Object(
  {
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
    tenant: __nullable__(
      t.Object(
        {
          id: t.String(),
          isDiplomatic: t.Boolean(),
          isPersonal: t.Boolean(),
          firstname: t.String(),
          lastname: t.String(),
          company: __nullable__(t.String()),
          phone: t.String(),
          email: t.String(),
          address: t.String(),
          maritalStatus: __nullable__(t.String()),
          income: __nullable__(t.Number()),
          bankInfo: t.String(),
          paymentMode: t.Array(t.String(), { additionalProperties: false }),
          documents: t.Array(t.String(), { additionalProperties: false }),
          monthlyRent: t.Number(),
          monthlyCharges: t.Number(),
          depositPaid: t.Number(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    teamMembers: t.Array(
      t.Object(
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
      { additionalProperties: false },
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

export const AppointmentPlainInputCreate = t.Object(
  {
    type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
      additionalProperties: false,
    }),
    date: t.Date(),
    hour: t.String(),
    minutes: t.String(),
    address: t.String(),
    subject: t.String(),
    note: t.String(),
    isComplete: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const AppointmentPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
        additionalProperties: false,
      }),
    ),
    date: t.Optional(t.Date()),
    hour: t.Optional(t.String()),
    minutes: t.Optional(t.String()),
    address: t.Optional(t.String()),
    subject: t.Optional(t.String()),
    note: t.Optional(t.String()),
    isComplete: t.Optional(t.Boolean()),
    isDeleting: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const AppointmentRelationsInputCreate = t.Object(
  {
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
    tenant: t.Optional(
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
    teamMembers: t.Optional(
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

export const AppointmentRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      tenant: t.Partial(
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
      teamMembers: t.Partial(
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

export const AppointmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          ownerId: t.String(),
          tenantId: t.String(),
          date: t.Date(),
          hour: t.String(),
          minutes: t.String(),
          address: t.String(),
          subject: t.String(),
          note: t.String(),
          isComplete: t.Boolean(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Appointment" },
  ),
);

export const AppointmentWhereUnique = t.Recursive(
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
              type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
                additionalProperties: false,
              }),
              ownerId: t.String(),
              tenantId: t.String(),
              date: t.Date(),
              hour: t.String(),
              minutes: t.String(),
              address: t.String(),
              subject: t.String(),
              note: t.String(),
              isComplete: t.Boolean(),
              isDeleting: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Appointment" },
);

export const AppointmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      type: t.Boolean(),
      ownerId: t.Boolean(),
      owner: t.Boolean(),
      tenantId: t.Boolean(),
      tenant: t.Boolean(),
      teamMembers: t.Boolean(),
      date: t.Boolean(),
      hour: t.Boolean(),
      minutes: t.Boolean(),
      address: t.Boolean(),
      subject: t.Boolean(),
      note: t.Boolean(),
      isComplete: t.Boolean(),
      isDeleting: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AppointmentInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      owner: t.Boolean(),
      tenant: t.Boolean(),
      teamMembers: t.Boolean(),
      notifications: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AppointmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tenantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      date: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hour: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      minutes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subject: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isComplete: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleting: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Appointment = t.Composite(
  [AppointmentPlain, AppointmentRelations],
  { additionalProperties: false },
);

export const AppointmentInputCreate = t.Composite(
  [AppointmentPlainInputCreate, AppointmentRelationsInputCreate],
  { additionalProperties: false },
);

export const AppointmentInputUpdate = t.Composite(
  [AppointmentPlainInputUpdate, AppointmentRelationsInputUpdate],
  { additionalProperties: false },
);
