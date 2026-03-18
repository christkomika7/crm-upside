import EditReservation from '@/components/forms/reservations/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/reservations/edit-reservation/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/reservations/edit-reservation/$id" })
  const id = param.id.split("edit_reservation-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditReservation id={id} />
  </div>
}
