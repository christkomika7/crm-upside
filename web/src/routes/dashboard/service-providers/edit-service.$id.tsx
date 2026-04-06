import EditServiceProvider from '@/components/forms/service-providers/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/service-providers/edit-service/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/service-providers/edit-service/$id" })
  const id = param.id.split("edit_service-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditServiceProvider id={id} />
  </div>
}
