import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/tenant/tenants'
import type { Tenant } from '@/types/tenant'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tenants/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, data: tenants } = useQuery<Tenant[]>({
    queryKey: ["tenants"],
    queryFn: () => apiFetch<Tenant[]>("/tenant"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Ajouter locataire' url='/dashboard/tenants/new-tenant' type='url' />
    <DataTable data={tenants || []} columns={columns} filters={["name", "company"]} isLoading={isPending} />
  </div>
}
