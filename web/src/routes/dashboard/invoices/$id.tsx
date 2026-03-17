import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/invoices/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/invoices/$id"!</div>
}
