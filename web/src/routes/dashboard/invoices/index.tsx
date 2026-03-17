import InvoiceCards from '@/components/dashboard/invoice/invoice-cards'
import InvoiceDataTable from '@/components/dashboard/invoice/invoice-data-table'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/invoices/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Nouvelle facture' url='/dashboard/invoices/new-invoice' type='url' />
    <InvoiceCards />
    <InvoiceDataTable />
  </div>
}
