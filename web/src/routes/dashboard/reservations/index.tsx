import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/reservation/reservations'
import { canAccess } from '@/lib/permission'
import type { ReservationTab } from '@/types/reservation'
import type { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reservations/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "reservations", ['read']);
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
  const hasCreateAccess = canAccess(permission, "reservations", ['create']);

  const { isPending, data: reservations } = useQuery<ReservationTab[]>({
    queryKey: ["reservations"],
    queryFn: () => apiFetch<ReservationTab[]>("/reservation"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Nouvelle reservation' url='/dashboard/reservations/new-reservation' type='url' showAction={hasCreateAccess} />
    <DataTable data={reservations || []} columns={columns} filters={["name"]} isLoading={isPending} />
  </div>
}
