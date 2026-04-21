import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UnitStatus = t.Union([t.Literal("FREE"), t.Literal("OCCUPED")], {
  additionalProperties: false,
});
