import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/contracts/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/contracts/$id"!</div>
}
