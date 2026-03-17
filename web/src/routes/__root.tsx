import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

interface RouterContext {
	queryClient: QueryClient;
	session: Awaited<ReturnType<typeof authClient.getSession>> | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async ({ context }) => {
		const session = await authClient.getSession();
		return {
			...context,
			session,
		};
	},
	component: () => <Outlet />,
});