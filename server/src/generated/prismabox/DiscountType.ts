import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DiscountType = t.Union(
  [t.Literal("PERCENT"), t.Literal("MONEY")],
  { additionalProperties: false },
);
