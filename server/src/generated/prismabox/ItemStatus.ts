import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ItemStatus = t.Union([t.Literal("USED"), t.Literal("IGNORE")], {
  additionalProperties: false,
});
