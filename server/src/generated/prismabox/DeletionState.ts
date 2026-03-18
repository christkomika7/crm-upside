import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DeletionState = t.Union(
  [t.Literal("NOTHING"), t.Literal("WAIT"), t.Literal("TERMINED")],
  { additionalProperties: false },
);
