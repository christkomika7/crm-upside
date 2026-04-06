import QuoteCards from '@/components/dashboard/quote/quote-cards'
import QuoteDataTable from '@/components/dashboard/quote/quote-data-table'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/quotes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau devis' url='/dashboard/quotes/new-quote' type='url' />
    <QuoteCards />
    <QuoteDataTable />
  </div>
}
