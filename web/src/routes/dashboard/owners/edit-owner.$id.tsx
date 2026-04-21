import EditOwners from '@/components/forms/owners/edit'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission';
import type { User } from '@/types/user';
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/owners/edit-owner/$id')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "owners", ['update']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/owners/edit-owner/$id" })
  const id = param.id.split("edit_owner-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditOwners id={id} />
  </div>
}
