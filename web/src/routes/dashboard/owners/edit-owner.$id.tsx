import EditOwners from '@/components/forms/owners/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/owners/edit-owner/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/owners/edit-owner/$id" })
  const id = param.id.split("edit_owner-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditOwners id={id} />
  </div>
}
