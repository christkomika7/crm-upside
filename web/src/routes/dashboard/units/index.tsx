import Brochure from '@/components/dashboard/unit/brochure'
import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/unit/units'
import { hasAccess } from '@/types/permissions'
import type { AuthSession } from '@/types/session'
import type { Units } from '@/types/unit'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/units/')({
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

  const { isPending, data: units } = useQuery<Units[]>({
    queryKey: ["units"],
    queryFn: () => apiFetch<Units[]>("/unit"),
  });

  return <div className='space-y-6'>
    <div className='space-y-6'>
      <ActionHeader title='Nouveau unités' url='/dashboard/units/new-unit' type='url' secondComponnet={<Brochure />} />
      <DataTable data={units || []} columns={columns} filters={["reference", "building", "owner", "tenant"]} sort="building" placeholder='Rechercher' isLoading={isPending} />
      <div className='flex justify-center'>
        <Button variant="inset-action" className='max-w-md'>Envoyer un mail</Button>
      </div>
    </div>
  </div>
}
