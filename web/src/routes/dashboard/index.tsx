import Balance from '@/components/dashboard/overview/balance'
import Expense from '@/components/dashboard/overview/expense'
import Intervention from '@/components/dashboard/overview/intervention'
import Occupancy from '@/components/dashboard/overview/occupancy'
import ReceivableCards from '@/components/dashboard/overview/receivable-cards'
import ReceivableList from '@/components/dashboard/overview/receivable-list'
import Revenue from '@/components/dashboard/overview/revenue'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, redirect } from '@tanstack/react-router'



export const Route = createFileRoute('/dashboard/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "dashboard", ['read']);
    if (!user) {
      throw redirect({ to: "/" });
    }
    if (!hasAccess) throw redirect({ to: "/error" })
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
