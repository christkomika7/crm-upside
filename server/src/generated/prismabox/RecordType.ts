import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RecordType = t.Union(
  [t.Literal("PURCHASE_ORDER"), t.Literal("INVOICE")],
  { additionalProperties: false },
);
