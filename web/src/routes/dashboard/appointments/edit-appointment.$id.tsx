import EditAppointment from '@/components/forms/appointment/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/appointments/edit-appointment/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <EditAppointment />
  </div>
}
