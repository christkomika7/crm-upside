import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/reservation/reservations'
import { hasAccess } from '@/types/permissions'
import type { ReservationTab } from '@/types/reservation'
import type { AuthSession } from '@/types/session'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reservations/')({
  beforeLoad({ context }) {
    const session = context.session as AuthSession;
    const buildings = session.data?.user.permission?.permissions.buildings;
    const access = hasAccess(
      !!context.session?.data?.user,
      buildings as unknown as string[],
    );

    if (!access) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
})
function RouteComponent() {
  const { isPending, data: reservations } = useQuery<ReservationTab[]>({
    queryKey: ["reservations"],
    queryFn: () => apiFetch<ReservationTab[]>("/reservation"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Nouvelle reservation' url='/dashboard/reservations/new-reservation' type='url' />
    <DataTable data={reservations || []} columns={columns} filters={["name"]} isLoading={isPending} />
  </div>
}
