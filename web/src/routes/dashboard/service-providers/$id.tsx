import ActionHeader from '@/components/header/action-header'
import InfosProviderCards from '@/components/dashboard/service-provider/infos-provider-card'
import ProviderInfos from '@/components/dashboard/service-provider/provider-infos'
import { createFileRoute } from '@tanstack/react-router'
import ProviderDataTable from '@/components/dashboard/service-provider/provider-data-table'

export const Route = createFileRoute('/dashboard/service-providers/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau bon de commande' hasIcon={false} url='/dashboard/service-providers/new-service' type='url' />
    <ProviderInfos />
    <InfosProviderCards />
    <ProviderDataTable />
  </div>
}
