import ReportCards from '@/components/dashboard/report/report-cards'
import ReportDataTable from '@/components/dashboard/report/report-data-table'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reports/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, 'checkInOutReports', ['read']);
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
  const hasCreateAccess = canAccess(permission, 'checkInOutReports', ['create']);
  return <div className='space-y-6'>
    <ActionHeader title='Nouvel état des lieux' type="url" url='/dashboard/reports/new-report' showAction={hasCreateAccess} />
    <ReportCards />
    <ReportDataTable />
  </div>
}
