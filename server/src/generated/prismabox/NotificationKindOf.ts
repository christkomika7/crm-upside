import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationKindOf = t.Union(
  [
    t.Literal("APPOINTMENT"),
    t.Literal("ACCOUNTING"),
    t.Literal("INVOICING"),
    t.Literal("RENTAL"),
    t.Literal("PAYMENT"),
    t.Literal("CONTRACT"),
  ],
  { additionalProperties: false },
);
