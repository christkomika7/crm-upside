import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentType = t.Union(
  [t.Literal("CASH"), t.Literal("CHECK"), t.Literal("BANK")],
  { additionalProperties: false },
);
