import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationType = t.Union(
  [t.Literal("ALERT"), t.Literal("CONFIRM")],
  { additionalProperties: false },
);
