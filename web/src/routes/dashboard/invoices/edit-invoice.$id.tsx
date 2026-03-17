import InvoiceTabs from '@/components/dashboard/invoice/invoice-tabs'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/invoices/edit-invoice/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <InvoiceTabs />
  </div>
}
