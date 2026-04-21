import ActionHeader from '@/components/header/action-header'
import ProviderCards from '@/components/dashboard/service-provider/provider-cards'
import DataTable from '@/components/table/data-table'
import { columns } from '@/lib/tables/service-provider/service-provider'
import { canAccess } from '@/lib/permission'
import type { ServiceProviderTab } from '@/types/service-provider'
import type { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/service-providers/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, 'serviceProviders', ['read']);
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
  const hasCreateAccess = canAccess(permission, 'serviceProviders', ['create']);

  const { isPending, data: serviceProviders } = useQuery<ServiceProviderTab[]>({
    queryKey: ["service-providers"],
    queryFn: () => apiFetch<ServiceProviderTab[]>("/service-provider"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Ajouter un prestataire' url='/dashboard/service-providers/new-service' type='url' showAction={hasCreateAccess} />
    <ProviderCards />
    <DataTable data={serviceProviders || []} columns={columns} filters={["name", "company"]} isLoading={isPending} />
  </div>
}
