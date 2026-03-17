import Balance from '@/components/dashboard/overview/balance'
import Expense from '@/components/dashboard/overview/expense'
import Intervention from '@/components/dashboard/overview/intervention'
import Occupancy from '@/components/dashboard/overview/occupancy'
import ReceivableCards from '@/components/dashboard/overview/receivable-cards'
import ReceivableList from '@/components/dashboard/overview/receivable-list'
import Revenue from '@/components/dashboard/overview/revenue'
import { createFileRoute, redirect } from '@tanstack/react-router'



export const Route = createFileRoute('/dashboard/')({
  beforeLoad({ context }) {
    if (!context.session?.data?.user) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <Balance />
    <div className='grid gap-6 grid-cols-[200px_1fr]'>
      <ReceivableList />
      <ReceivableCards />
    </div>
    <div className="grid grid-cols-2 gap-6">
      <Expense />
      <Revenue />
      <Intervention />
      <Occupancy />
    </div>
  </div>
}
