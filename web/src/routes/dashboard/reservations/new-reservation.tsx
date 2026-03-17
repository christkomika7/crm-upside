import CreateReservation from '@/components/forms/reservations/create'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reservations/new-reservation')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <CreateReservation />
  </div>
}
