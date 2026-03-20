import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/product-service/product-service'
import { hasAccess } from '@/types/permissions'
import type { ProductService, } from '@/types/product-service'
import type { AuthSession } from '@/types/session'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/product-service/')({
  beforeLoad({ context }) {
    const session = context.session as AuthSession;
    const buildings = session.data?.user.permission?.permissions.buildings;
    const access = hasAccess(
      !!context.session?.data?.user,
      buildings as unknown as string[],
    );

    if (!access) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, data: productServices } = useQuery<ProductService[]>({
    queryKey: ["product-services"],
    queryFn: () => apiFetch<ProductService[]>("/product-service"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Nouveau produit | service' url='/dashboard/product-service/new-product-service' type='url' />
    <DataTable data={productServices || []} columns={columns} filters={["reference", "description"]} isLoading={isPending} />
  </div>
}
