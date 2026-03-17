import AccountingCards from '@/components/dashboard/accounting/accounting-cards'
import ActionHeader from '@/components/header/action-header'
import ExportTo from '@/components/modal/export-to'
import DataTable from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { columns, data } from '@/lib/tables/accounting/accounting'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/accounting/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader type='modal' component={
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="action" className='w-fit'>Nouvelle entrée</Button>
        </PopoverTrigger>
        <PopoverContent align="end" side="bottom" className="w-52 p-0">
          <PopoverArrow />
          <ul className=" text-sm text-neutral-600">
            <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center" >
              <Link className='w-full h-full' to="/dashboard/accounting/new-accounting" search={{ type: "income" }}>
                Ajouter une entrée
              </Link>
            </li>
            <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">
              <Link className='w-full h-full' to="/dashboard/accounting/new-accounting" search={{ type: "outcome" }}>
                Ajouter une sortie
              </Link>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    } secondComponnet={<ExportTo title="Exporter" >
      <Button variant="inset-action" className="w-fit">Exporter</Button>
    </ExportTo>} />
    <AccountingCards />
    <DataTable data={data} columns={columns} filters={["name", "company"]} />
  </div>
}
