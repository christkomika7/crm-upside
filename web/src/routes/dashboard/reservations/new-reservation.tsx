import CreateReservation from '@/components/forms/reservations/create'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reservations/new-reservation')(
  {
    beforeLoad: ({ context }) => {
      const user = context.session.data?.user as unknown as User;
      const permission = user.permission?.permissions;
      const hasAccess = canAccess(permission, 'reservations', ['create']);
      if (!user) {
        throw redirect({ to: "/", search: { redirect: location.href } });
      }
      if (!hasAccess) throw notFound()
    },
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <CreateReservation />
  </div>
}
