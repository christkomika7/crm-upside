import EditPropertyManagement from '@/components/forms/property-management/edit';
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/property-management/edit-property/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/property-management/edit-property/$id" })
  const id = param.id.split("edit_property-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditPropertyManagement id={id} />
  </div>
}
