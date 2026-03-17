import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { columns, data } from '@/lib/tables/reservation/reservations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reservations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Nouvelle reservation' url='/dashboard/reservations/new-reservation' type='url' />
    <DataTable data={data} columns={columns} filters={["name", "company"]} />
  </div>
}
