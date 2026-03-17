import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins"
import { SERVER_HOST } from "../host";
import type { Auth } from "better-auth/types";

export const authClient = createAuthClient({
    baseURL: import.meta.env.BUN_PUBLIC_API_URL || SERVER_HOST,
    plugins: [
        customSessionClient<Auth>()
    ]
});

