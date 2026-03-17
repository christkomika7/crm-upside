import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/owner/owners'
import type { Owner } from '@/types/owner'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/owners/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, data: owners } = useQuery<Owner[]>({
    queryKey: ["owners"],
    queryFn: () => apiFetch<Owner[]>("/owner"),
  });
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau propriétaire' url='/dashboard/owners/new-owner' type='url' />
    <DataTable data={owners || []} columns={columns} filters={["reference", "name"]} isLoading={isPending} />
  </div>
}
