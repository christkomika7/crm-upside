import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationPlain = t.Object(
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
);

export const NotificationRelations = t.Object(
  {
    accounting: __nullable__(
      t.Object(
        {
          id: t.String(),
          date: t.Date(),
          type: t.Union([t.Literal("INFLOW"), t.Literal("OUTFLOW")], {
            additionalProperties: false,
          }),
          paymentMode: t.Union(
            [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          isTTC: t.Boolean(),
          checkNumber: __nullable__(t.String()),
          description: t.String(),
          period: __nullable__(t.Date()),
          unitId: __nullable__(t.String()),
          sourceId: t.String(),
          allocationId: __nullable__(t.String()),
          categoryId: t.String(),
          natureId: t.String(),
          secondNatureId: __nullable__(t.String()),
          thirdNatureId: __nullable__(t.String()),
          userId: t.String(),
          documents: t.Array(t.String(), { additionalProperties: false }),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    invoice: __nullable__(
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
          type: t.Union([t.Literal("OWNER"), t.Literal("TENANT")], {
            additionalProperties: false,
          }),
          ownerId: __nullable__(t.String()),
          tenantId: __nullable__(t.String()),
          note: __nullable__(t.String()),
          start: t.Date(),
          end: t.Date(),
          isDeleting: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    payment: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          amount: t.Number(),
          recordType: t.Union(
            [t.Literal("PURCHASE_ORDER"), t.Literal("INVOICE")],
            { additionalProperties: false },
          ),
          type: t.Union(
            [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
            { additionalProperties: false },
          ),
          date: t.Date(),
          invoiceId: __nullable__(t.String()),
          purchaseOrderId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    rental: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          tenantId: t.String(),
          unitId: t.String(),
          isDeleting: t.Boolean(),
          price: t.Number(),
          charges: t.Number(),
          extrasCharges: t.Number(),
          furnished: t.String(),
          start: t.Date(),
          end: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    contract: __nullable__(
      t.Object(
        {
          id: t.String(),
          reference: t.Integer(),
          type: t.Union([t.Literal("CONTRACT"), t.Literal("MANDATE")], {
            additionalProperties: false,
          }),
          rentalId: __nullable__(t.String()),
          buildingId: __nullable__(t.String()),
          isCanceled: t.Boolean(),
          isDeleting: t.Boolean(),
          updatedAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    appointment: __nullable__(
      t.Object(
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
      ),
    ),
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
    notificationReads: t.Array(
      t.Object(
        {
          id: t.String(),
          notificationId: t.String(),
          userId: t.String(),
          readAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const NotificationPlainInputCreate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("ALERT"), t.Literal("CONFIRM")], {
        additionalProperties: false,
      }),
    ),
    active: t.Optional(t.Boolean()),
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
    message: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const NotificationPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("ALERT"), t.Literal("CONFIRM")], {
        additionalProperties: false,
      }),
    ),
    active: t.Optional(t.Boolean()),
    for: t.Optional(
      t.Union(
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
    ),
    message: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const NotificationRelationsInputCreate = t.Object(
  {
    accounting: t.Optional(
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
    invoice: t.Optional(
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
    payment: t.Optional(
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
    rental: t.Optional(
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
    contract: t.Optional(
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
    appointment: t.Optional(
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
    notificationReads: t.Optional(
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

export const NotificationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      accounting: t.Partial(
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
      invoice: t.Partial(
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
      payment: t.Partial(
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
      rental: t.Partial(
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
      contract: t.Partial(
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
      appointment: t.Partial(
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
      notificationReads: t.Partial(
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

export const NotificationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          message: t.String(),
          accountingId: t.String(),
          invoiceId: t.String(),
          paymentId: t.String(),
          rentalId: t.String(),
          contractId: t.String(),
          appointmentId: t.String(),
          userId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Notification" },
  ),
);

export const NotificationWhereUnique = t.Recursive(
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
              message: t.String(),
              accountingId: t.String(),
              invoiceId: t.String(),
              paymentId: t.String(),
              rentalId: t.String(),
              contractId: t.String(),
              appointmentId: t.String(),
              userId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Notification" },
);

export const NotificationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      type: t.Boolean(),
      active: t.Boolean(),
      for: t.Boolean(),
      message: t.Boolean(),
      accountingId: t.Boolean(),
      accounting: t.Boolean(),
      invoiceId: t.Boolean(),
      invoice: t.Boolean(),
      paymentId: t.Boolean(),
      payment: t.Boolean(),
      rentalId: t.Boolean(),
      rental: t.Boolean(),
      contractId: t.Boolean(),
      contract: t.Boolean(),
      appointmentId: t.Boolean(),
      appointment: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      notificationReads: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NotificationInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      for: t.Boolean(),
      accounting: t.Boolean(),
      invoice: t.Boolean(),
      payment: t.Boolean(),
      rental: t.Boolean(),
      contract: t.Boolean(),
      appointment: t.Boolean(),
      user: t.Boolean(),
      notificationReads: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NotificationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      message: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountingId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paymentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rentalId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contractId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Notification = t.Composite(
  [NotificationPlain, NotificationRelations],
  { additionalProperties: false },
);

export const NotificationInputCreate = t.Composite(
  [NotificationPlainInputCreate, NotificationRelationsInputCreate],
  { additionalProperties: false },
);

export const NotificationInputUpdate = t.Composite(
  [NotificationPlainInputUpdate, NotificationRelationsInputUpdate],
  { additionalProperties: false },
);
