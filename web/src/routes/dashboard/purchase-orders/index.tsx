import PurchaseOrderCards from '@/components/dashboard/purchase-order/purchase-order-cards'
import PurchaseOrderDataTable from '@/components/dashboard/purchase-order/purchase-order-data-table'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/purchase-orders/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau bon de commande' url='/dashboard/purchase-orders/new-purchase-order' type='url' />
    <PurchaseOrderCards />
    <PurchaseOrderDataTable />
  </div>
}
