import Info from '@/components/dashboard/current/info'
import TabDataList from '@/components/dashboard/property-management/tab-data-list'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/property-management/$id')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "propertyManagement", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: "/dashboard/property-management/$id" });

  return <div className='space-y-6'>
    <ActionHeader title='Generate a Breakdown' url='/' type='url' hasIcon={false} />
    <Info id={id} />
    <TabDataList id={id} />
  </div>
}
