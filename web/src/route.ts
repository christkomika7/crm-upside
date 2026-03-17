import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/query-client";
import { authClient } from "./lib/auth/auth-client";

const session = authClient.getSession();

export const router = createRouter({
    routeTree,
    context: {
        queryClient,
        session,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
