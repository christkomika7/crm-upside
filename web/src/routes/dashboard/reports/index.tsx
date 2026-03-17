import ReportCards from '@/components/dashboard/report/report-cards'
import ReportDataTable from '@/components/dashboard/report/report-data-table'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reports/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader title='Nouvel enregistrement' type="url" url='/dashboard/reports/new-report' />
    <ReportCards />
    <ReportDataTable />
  </div>
}
