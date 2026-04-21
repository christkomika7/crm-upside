import TabDataList from '@/components/dashboard/tenant/tab-data-list'
import TenantCards from '@/components/dashboard/tenant/tenant-cards'
import ActionHeader from '@/components/header/action-header'
import StatementModal from '@/components/modal/statement'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

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
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasCreateAccess = canAccess(permission, 'tenants', ['create']);

  const params = useParams({ from: "/dashboard/tenants/$id" });
  const id = params.id.split("tenant-")[1];

  return <div className='space-y-6'>
    <ActionHeader title="Statement" type='modal' hasIcon={false} showComponent={hasCreateAccess} component={<StatementModal title="Statement" />} />
    <TenantCards id={id} />
    <TabDataList id={id} />
  </div>
}
