import TabDataList from '@/components/dashboard/tenant/tab-data-list'
import TenantCards from '@/components/dashboard/tenant/tenant-cards'
import ActionHeader from '@/components/header/action-header'
import StatementModal from '@/components/modal/statement'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tenants/$id')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "tenants", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const title = "Statement";
  return <div className='space-y-6'>
    <ActionHeader title={title} type='modal' hasIcon={false} component={<StatementModal title={title} />} />
    <TenantCards />
    <TabDataList />
  </div>
}
