import EditBuilding from '@/components/forms/buildings/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/buildings/edit-building/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const param = useParams({ from: "/dashboard/buildings/edit-building/$id" })
    const id = param.id.split("edit_building-")[1];
    return <div className='space-y-6'>
        <ActionHeader />
        <EditBuilding id={id} />
    </div>
}
