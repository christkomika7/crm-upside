import EditProductService from '@/components/forms/product-service/edit';
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/product-service/edit-product-service/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/product-service/edit-product-service/$id" })
  const id = param.id.split("edit_product-service-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <EditProductService id={id} />
  </div>
}
