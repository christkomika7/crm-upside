import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/building/buildings'
import type { Building } from '@/types/building'
import { hasAccess } from '@/types/permissions'
import type { AuthSession } from '@/types/session'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/buildings/')({
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

  const { isPending, data: buildings } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: () => apiFetch<Building[]>("/building"),
  });


  return <div className='space-y-6'>
    <div className='space-y-6'>
      <ActionHeader title='Nouveau bâtiments' url='/dashboard/buildings/new-building' type='url' />
      <DataTable data={buildings || []} columns={columns} filters={["reference", "company", "name", "email"]} isLoading={isPending} />
    </div>
  </div>
}
