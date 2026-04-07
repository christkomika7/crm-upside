import CreatePurchaseOrder from '@/components/forms/purchase-orders/create'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/purchase-orders/new-purchase-order')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <CreatePurchaseOrder />
  </div>
}
