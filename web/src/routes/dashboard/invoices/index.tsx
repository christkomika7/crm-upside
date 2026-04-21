import InvoiceCards from '@/components/dashboard/invoice/invoice-cards'
import InvoiceDataTable from '@/components/dashboard/invoice/invoice-data-table'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/invoices/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "invoicing", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasCreateAccess = canAccess(permission, "invoicing", ['create']);
  return <div className='space-y-6'>
    <ActionHeader title='Nouvelle facture' url='/dashboard/invoices/new-invoice' type='url' showAction={hasCreateAccess} />
    <InvoiceCards />
    <InvoiceDataTable />
  </div>
}
