import Attachment from '@/components/dashboard/building/attachment'
import DataList from '@/components/dashboard/building/data-list'
import Info from '@/components/dashboard/current/info'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/buildings/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Owner statement' url='/' type='url' hasIcon={false} />
    <Info />
    <Attachment />
    <DataList />
  </div>
}
