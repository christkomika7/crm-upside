import CreateRental from '@/components/forms/rentals/create'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/rentals/new-rental')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='space-y-6'>
        <ActionHeader />
        <CreateRental />
    </div>
}
