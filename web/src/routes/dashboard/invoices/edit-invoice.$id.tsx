import InvoiceTabs from '@/components/dashboard/invoice/invoice-tabs'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/invoices/edit-invoice/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/invoices/edit-invoice/$id" })
  const id = param.id.split("edit_invoice-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <InvoiceTabs id={id} />
  </div>
}
