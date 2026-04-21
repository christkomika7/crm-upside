import Attachments from '@/components/dashboard/owner/attachments'
import OwnerCards from '@/components/dashboard/owner/owner-cards'
import TabDataList from '@/components/dashboard/owner/tab-data-list'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission';
import type { User } from '@/types/user';
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/owners/$id')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "owners", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/dashboard/owners/$id' });
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasUpdateAccess = canAccess(permission, "owners", ['update']);
  return <div className='space-y-6'>
    <ActionHeader title='Relevé du propriétaire' url='#' hasIcon={false} type='url' showAction={hasUpdateAccess} />
    <OwnerCards id={id} />
    <Attachments id={id} />
    <TabDataList id={id} />
  </div>
}
