import EditUnit from '@/components/forms/units/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/units/edit-unit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/units/edit-unit/$id" })
  const id = param.id.split("edit_unit-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditUnit id={id} />
  </div>
}
