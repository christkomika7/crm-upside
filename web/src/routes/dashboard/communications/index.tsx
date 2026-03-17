import CommunicationDataTable from '@/components/dashboard/communication/communication-data-table'
import ActionHeader from '@/components/header/action-header'
import { Button } from '@/components/ui/button'
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/communications/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader type='modal'
      component={
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="action" className='w-fit'>Nouvelle communication</Button>
          </PopoverTrigger>
          <PopoverContent align="end" side="bottom" className="w-52 p-0">
            <PopoverArrow />
            <ul className=" text-sm text-neutral-600">
              <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center" >
                <Link className='w-full h-full' to="/dashboard/communications/new-communication" search={{ type: "letter" }}>
                  Lettre
                </Link>
              </li>
              <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">
                <Link className='w-full h-full' to="/dashboard/communications/new-communication" search={{ type: "note" }}>
                  Note
                </Link>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      }
    />
    <CommunicationDataTable />
  </div>
}
