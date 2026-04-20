import Attachment from '@/components/dashboard/building/attachment'
import DataList from '@/components/dashboard/building/data-list'
import Info from '@/components/dashboard/current/info'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/buildings/$id')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "buildings", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Owner statement' url='/' type='url' hasIcon={false} />
    <Info />
    <Attachment />
    <DataList />
  </div>
}
