import EditServiceProvider from '@/components/forms/service-providers/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/service-providers/edit-service/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <EditServiceProvider />
  </div>
}
