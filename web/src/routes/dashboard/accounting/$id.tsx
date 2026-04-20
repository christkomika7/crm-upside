import { canAccess } from '@/lib/permission';
import type { User } from '@/types/user';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/accounting/$id')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "accounting", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/accounting/$id"!</div>
}
