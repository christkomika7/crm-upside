import EditProductService from '@/components/forms/product-service/edit';
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams, notFound, redirect } from '@tanstack/react-router'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'

export const Route = createFileRoute('/dashboard/product-service/edit-product-service/$id')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "productService", ['update']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
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
