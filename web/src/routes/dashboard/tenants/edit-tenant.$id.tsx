import EditTenant from '@/components/forms/tenants/edit'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tenants/edit-tenant/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const param = useParams({ from: "/dashboard/tenants/edit-tenant/$id" })
    const id = param.id.split("edit_tenant-")[1];
    return <div className='space-y-6'>
        <ActionHeader />
        <EditTenant id={id} />
    </div>
}
