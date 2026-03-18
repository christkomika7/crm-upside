import RentalCards from '@/components/dashboard/rental/rental-cards'
import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/rental/rentals'
import type { Rental } from '@/types/rental'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/rentals/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, data: rentals } = useQuery<Rental[]>({
    queryKey: ["rentals"],
    queryFn: () => apiFetch<Rental[]>("/rental"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Nouvelle location' url='/dashboard/rentals/new-rental' type='url' />
    <RentalCards />
    <DataTable data={rentals || []} columns={columns} filters={['']} sort='tenant' isLoading={isPending} />
  </div>
}
