import ReportTabs from '@/components/dashboard/report/report-tabs'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reports/edit-report/$id')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, 'checkInOutReports', ['update']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as "edit" | "preview" | "share") || "edit",
    };
  },
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <ReportTabs />
  </div>
}
