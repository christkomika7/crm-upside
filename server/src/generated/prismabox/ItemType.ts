import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ItemType = t.Union([t.Literal("ITEM"), t.Literal("UNIT")], {
  additionalProperties: false,
});
