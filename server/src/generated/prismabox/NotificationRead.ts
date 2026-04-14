import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationReadPlain = t.Object(
  {
    id: t.String(),
    notificationId: t.String(),
    userId: t.String(),
    readAt: t.Date(),
  },
  { additionalProperties: false },
);

export const NotificationReadRelations = t.Object(
  {
    notification: t.Object(
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

export const NotificationReadPlainInputCreate = t.Object(
  { readAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const NotificationReadPlainInputUpdate = t.Object(
  { readAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const NotificationReadRelationsInputCreate = t.Object(
  {
    notification: t.Object(
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

export const NotificationReadRelationsInputUpdate = t.Partial(
  t.Object(
    {
      notification: t.Object(
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

export const NotificationReadWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          notificationId: t.String(),
          userId: t.String(),
          readAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "NotificationRead" },
  ),
);

export const NotificationReadWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              notificationId_userId: t.Object(
                { notificationId: t.String(), userId: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              notificationId_userId: t.Object(
                { notificationId: t.String(), userId: t.String() },
                { additionalProperties: false },
              ),
            }),
          ],
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
              notificationId: t.String(),
              userId: t.String(),
              readAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "NotificationRead" },
);

export const NotificationReadSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      notificationId: t.Boolean(),
      notification: t.Boolean(),
      userId: t.Boolean(),
      user: t.Boolean(),
      readAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NotificationReadInclude = t.Partial(
  t.Object(
    { notification: t.Boolean(), user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const NotificationReadOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notificationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      readAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const NotificationRead = t.Composite(
  [NotificationReadPlain, NotificationReadRelations],
  { additionalProperties: false },
);

export const NotificationReadInputCreate = t.Composite(
  [NotificationReadPlainInputCreate, NotificationReadRelationsInputCreate],
  { additionalProperties: false },
);

export const NotificationReadInputUpdate = t.Composite(
  [NotificationReadPlainInputUpdate, NotificationReadRelationsInputUpdate],
  { additionalProperties: false },
);
