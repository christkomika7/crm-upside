import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/accounting/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/accounting/$id"!</div>
}
