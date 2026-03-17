import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/communications/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/communications/$id"!</div>
}
