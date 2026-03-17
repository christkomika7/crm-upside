import PropertyCards from '@/components/dashboard/property/property-cards'
import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { columns, data } from '@/lib/tables/property-manangement/properties'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/property-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='New Rental' url='/dashboard/property-management/new-property' type='url' />
    <PropertyCards />
    <DataTable data={data} columns={columns} filters={["name", "company"]} />
  </div>
}
