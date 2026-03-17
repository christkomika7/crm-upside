import Attachments from '@/components/dashboard/owner/attachments'
import OwnerCards from '@/components/dashboard/owner/owner-cards'
import TabDataList from '@/components/dashboard/owner/tab-data-list'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/owners/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Relevé du propriétaire' url='/' hasIcon={false} type='url' />
    <OwnerCards />
    <Attachments />
    <TabDataList />
  </div>
}
