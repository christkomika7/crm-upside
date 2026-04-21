import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/product-service/product-service'
import type { ProductService, } from '@/types/product-service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'

export const Route = createFileRoute('/dashboard/product-service/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "productService", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasCreateAccess = canAccess(permission, "productService", ['create']);

  const { isPending, data: productServices } = useQuery<ProductService[]>({
    queryKey: ["product-services"],
    queryFn: () => apiFetch<ProductService[]>("/product-service"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Nouveau produit | service' url='/dashboard/product-service/new-product-service' type='url' showAction={hasCreateAccess} />
    <DataTable data={productServices || []} columns={columns} filters={["reference", "description"]} isLoading={isPending} />
  </div>
}
