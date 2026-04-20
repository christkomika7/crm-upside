import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DeletionType = t.Union(
  [
    t.Literal("ACCOUNTING"),
    t.Literal("OWNER"),
    t.Literal("BUILDING"),
    t.Literal("TENANT"),
    t.Literal("UNIT"),
    t.Literal("RENTAL"),
    t.Literal("RESERVATION"),
    t.Literal("PROPERTY_MANAGEMENT"),
    t.Literal("PRODUCT_SERVICE"),
    t.Literal("INVOICING"),
    t.Literal("QUOTE"),
    t.Literal("PURCHASE_ORDER"),
    t.Literal("CONTRACT"),
    t.Literal("CHECK_IN"),
    t.Literal("APPOINTMENT"),
    t.Literal("SERVICE_PROVIDER"),
    t.Literal("COMMUNICATION"),
  ],
  { additionalProperties: false },
);
