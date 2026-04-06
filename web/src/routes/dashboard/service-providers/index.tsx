import ActionHeader from '@/components/header/action-header'
import ProviderCards from '@/components/dashboard/service-provider/provider-cards'
import DataTable from '@/components/table/data-table'
import { columns } from '@/lib/tables/service-provider/service-provider'
import { createFileRoute } from '@tanstack/react-router'
import type { ServiceProviderTab } from '@/types/service-provider'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

export const Route = createFileRoute('/dashboard/service-providers/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { isPending, data: serviceProviders } = useQuery<ServiceProviderTab[]>({
    queryKey: ["service-providers"],
    queryFn: () => apiFetch<ServiceProviderTab[]>("/service-provider"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Ajouter un prestataire' url='/dashboard/service-providers/new-service' type='url' />
    <ProviderCards />
    <DataTable data={serviceProviders || []} columns={columns} filters={["name", "company"]} isLoading={isPending} />
  </div>
}
