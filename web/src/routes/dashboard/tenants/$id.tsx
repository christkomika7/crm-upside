import TabDataList from '@/components/dashboard/tenant/tab-data-list'
import TenantCards from '@/components/dashboard/tenant/tenant-cards'
import ActionHeader from '@/components/header/action-header'
import StatementModal from '@/components/modal/statement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tenants/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const title = "Statement";
  return <div className='space-y-6'>
    <ActionHeader title={title} type='modal' hasIcon={false} component={<StatementModal title={title} />} />
    <TenantCards />
    <TabDataList />
  </div>
}
