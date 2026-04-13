import CreateUnit from '@/components/forms/units/create'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission';
import type { User } from '@/types/user';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/units/new-unit')({
  component: RouteComponent,
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "units", ['create']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <CreateUnit />
  </div>
}
