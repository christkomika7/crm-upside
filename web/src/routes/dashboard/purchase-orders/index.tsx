import PurchaseOrderCards from '@/components/dashboard/purchase-order/purchase-order-cards'
import PurchaseOrderDataTable from '@/components/dashboard/purchase-order/purchase-order-data-table'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/purchase-orders/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "purchaseOrders", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasCreateAccess = canAccess(permission, "purchaseOrders", ['create']);
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau bon de commande' url='/dashboard/purchase-orders/new-purchase-order' type='url' showAction={hasCreateAccess} />
    <PurchaseOrderCards />
    <PurchaseOrderDataTable />
  </div>
}
