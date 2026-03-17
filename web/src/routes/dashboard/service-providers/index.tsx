import ActionHeader from '@/components/header/action-header'
import ProviderCards from '@/components/dashboard/service-provider/provider-cards'
import DataTable from '@/components/table/data-table'
import { columns, data } from '@/lib/tables/service-provider/service-provider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/service-providers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Ajouter un prestataire' url='/dashboard/service-providers/new-service' type='url' />
    <ProviderCards />
    <DataTable data={data} columns={columns} filters={["name", "company"]} />
  </div>
}
