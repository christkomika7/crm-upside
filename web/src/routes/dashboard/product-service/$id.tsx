import Info from '@/components/dashboard/current/info'
import TabDataList from '@/components/dashboard/property-management/tab-data-list'
import ActionHeader from '@/components/header/action-header'
import { hasAccess } from '@/types/permissions'
import type { AuthSession } from '@/types/session'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/product-service/$id')({
  beforeLoad({ context }) {
    const session = context.session as AuthSession;
    const buildings = session.data?.user.permission?.permissions.buildings;
    const access = hasAccess(
      !!context.session?.data?.user,
      buildings as unknown as string[],
    );

    if (!access) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Produit ou service' url='/' type='url' hasIcon={false} />
    <Info />
    <TabDataList />
  </div>
}
