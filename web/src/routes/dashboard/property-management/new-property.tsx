import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/dashboard/property-management/new-property',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='space-y-6'>
        <ActionHeader />
    </div>
}
