import EditAccounting from '@/components/forms/accounting/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/dashboard/accounting/edit-accounting/$id',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='space-y-6'>
        <ActionHeader />
        <EditAccounting />
    </div>
}

