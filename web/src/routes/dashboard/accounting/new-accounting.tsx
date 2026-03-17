import CreateAccounting from '@/components/forms/accounting/create'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/accounting/new-accounting')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='space-y-6'>
        <ActionHeader />
        <CreateAccounting />
    </div>
}
