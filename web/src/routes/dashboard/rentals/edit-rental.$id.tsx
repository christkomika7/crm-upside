import EditRental from '@/components/forms/rentals/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/rentals/edit-rental/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const param = useParams({ from: "/dashboard/rentals/edit-rental/$id" })
    const id = param.id.split("edit_rental-")[1];
    return <div className='space-y-6'>
        <ActionHeader />
        <EditRental id={id} />
    </div>
}
