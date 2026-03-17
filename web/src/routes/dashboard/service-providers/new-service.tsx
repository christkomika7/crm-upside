import CreateServiceProvider from '@/components/forms/service-providers/create'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/service-providers/new-service',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <CreateServiceProvider />
  </div>
}
