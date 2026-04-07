import PurchaseOrderTabs from '@/components/dashboard/purchase-order/purchase-order-tabs';
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/purchase-orders/edit-purchase-order/$id')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: (search.type as string) || "edit",
    };
  },
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/purchase-orders/edit-purchase-order/$id" })
  const id = param.id.split("edit_purchase_order-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <PurchaseOrderTabs id={id} />
  </div>
}
