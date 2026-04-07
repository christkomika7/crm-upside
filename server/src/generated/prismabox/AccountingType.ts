import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountingType = t.Union(
  [t.Literal("INFLOW"), t.Literal("OUTFLOW")],
  { additionalProperties: false },
);
