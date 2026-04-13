import EditUnit from '@/components/forms/units/edit'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission';
import type { User } from '@/types/user';
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/units/edit-unit/$id')({
  component: RouteComponent,
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "units", ['update']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/units/edit-unit/$id" })
  const id = param.id.split("edit_unit-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditUnit key={id} id={id} />
  </div>
}
