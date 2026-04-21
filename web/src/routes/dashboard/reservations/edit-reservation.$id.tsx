import EditReservation from '@/components/forms/reservations/edit'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reservations/edit-reservation/$id')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, 'reservations', ['update']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
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
