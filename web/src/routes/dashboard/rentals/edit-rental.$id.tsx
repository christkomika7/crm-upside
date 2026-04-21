import EditRental from '@/components/forms/rentals/edit'
import ActionHeader from '@/components/header/action-header'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/rentals/edit-rental/$id')({
    beforeLoad: ({ context }) => {
        const user = context.session.data?.user as unknown as User;
        const permission = user.permission?.permissions;
        const hasAccess = canAccess(permission, "rentals", ['update']);
        if (!user) {
            throw redirect({ to: "/", search: { redirect: location.href } });
        }
        if (!hasAccess) throw notFound()
    },
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
