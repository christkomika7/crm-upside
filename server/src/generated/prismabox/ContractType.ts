import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ContractType = t.Union(
  [t.Literal("CONTRACT"), t.Literal("MANDATE")],
  { additionalProperties: false },
);
