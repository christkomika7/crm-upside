import AppointmentCards from '@/components/dashboard/appointment/appointment-cards'
import AppointmentDataTable from '@/components/dashboard/appointment/appointment-data-table'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/appointments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau rendez-vous' url='/dashboard/appointments/new-appointment' type='url' />
    <AppointmentCards />
    <AppointmentDataTable />
  </div>
}
