import ReportTabs from '@/components/dashboard/report/report-tabs'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reports/edit-report/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <ReportTabs />
  </div>
}
