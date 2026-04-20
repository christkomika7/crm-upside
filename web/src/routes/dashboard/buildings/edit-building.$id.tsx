import EditBuilding from '@/components/forms/buildings/edit'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission';
import type { User } from '@/types/user';
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/buildings/edit-building/$id')({
    beforeLoad({ context }) {
        const user = context.session.data?.user as unknown as User;
        const permission = user.permission?.permissions;
        const hasAccess = canAccess(permission, "buildings", ['update']);
        if (!user) {
            throw redirect({ to: "/", search: { redirect: location.href } });
        }
        if (!hasAccess) throw notFound()
    },
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
