import AppointmentCards from '@/components/dashboard/appointment/appointment-cards'
import AppointmentDataTable from '@/components/dashboard/appointment/appointment-data-table'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission';
import type { User } from '@/types/user';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/appointments/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "appointments", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasCreateAccess = canAccess(permission, "appointments", ['create']);
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau rendez-vous' url='/dashboard/appointments/new-appointment' type='url' showAction={hasCreateAccess} />
    <AppointmentCards />
    <AppointmentDataTable />
  </div>
}
