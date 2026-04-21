import PropertyCards from '@/components/dashboard/property/property-cards'
import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/property-manangement/properties'
import type { PropertyManagementTab } from '@/types/property-management'
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { canAccess } from '@/lib/permission'

export const Route = createFileRoute('/dashboard/property-management/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "propertyManagement", ['read']);
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
  const hasCreateAccess = canAccess(permission, "propertyManagement", ['create']);

  const { isPending, data: propertyManagements } = useQuery<PropertyManagementTab[]>({
    queryKey: ["property-managements"],
    queryFn: () => apiFetch<PropertyManagementTab[]>("/property-management"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Nouvel gestion' url='/dashboard/property-management/new-property' type='url' showAction={hasCreateAccess} />
    <PropertyCards />
    <DataTable data={propertyManagements || []} columns={columns} filters={["name", "company"]} isLoading={isPending} />
  </div>
}
