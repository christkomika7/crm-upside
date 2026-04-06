import EditAppointment from '@/components/forms/appointment/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/appointments/edit-appointment/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/appointments/edit-appointment/$id" })
  const id = param.id.split("edit_appointment-")[1];

  return <div className='space-y-6'>
    <ActionHeader />
    <EditAppointment id={id} />
  </div>
}
