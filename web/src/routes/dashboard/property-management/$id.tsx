import Info from '@/components/dashboard/current/info'
import TabDataList from '@/components/dashboard/property-management/tab-data-list'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/property-management/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Generate a Breakdown' url='/' type='url' hasIcon={false} />
    <Info />
    <TabDataList />
  </div>
}
