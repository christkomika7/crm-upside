import CreateInvoices from '@/components/forms/invoices/create'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/invoices/new-invoice')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <CreateInvoices />
  </div>
}
