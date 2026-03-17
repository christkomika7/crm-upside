import EditReservation from '@/components/forms/reservations/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/reservations/edit-reservation/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <EditReservation />
  </div>
}
