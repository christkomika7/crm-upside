import QuoteCards from '@/components/dashboard/quote/quote-cards'
import QuoteDataTable from '@/components/dashboard/quote/quote-data-table'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/quotes/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "quotes", ['read']);
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
  const hasCreateAccess = canAccess(permission, "quotes", ['create']);
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau devis' url='/dashboard/quotes/new-quote' type='url' showAction={hasCreateAccess} />
    <QuoteCards />
    <QuoteDataTable />
  </div>
}
