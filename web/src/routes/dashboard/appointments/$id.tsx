import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/appointments/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/dashboard/appointment/$id"!</div>
}
