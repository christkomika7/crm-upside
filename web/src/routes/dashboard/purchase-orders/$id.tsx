import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/purchase-orders/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/invoices/$id"!</div>
}
