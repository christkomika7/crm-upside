import { t } from "elysia";
import { DeletionType } from "../../types/deletion";


export default {
    body: t.Enum({ DELETE: "DELETE", CANCEL: "CANCEL" }),
    params: t.Object({ id: t.String() }),
    query: t.Object({
        type: t.Enum(DeletionType)
    }),
    user: {
        name: t.String(),
        email: t.String(),
        emailVerified: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
        role: t.Enum({ ADMIN: "ADMIN", USER: "USER" }),
        id: t.String()
    }
} 