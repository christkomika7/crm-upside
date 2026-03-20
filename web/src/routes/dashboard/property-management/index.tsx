import PropertyCards from '@/components/dashboard/property/property-cards'
import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/property-manangement/properties'
import { hasAccess } from '@/types/permissions'
import type { PropertyManagementTab } from '@/types/property-management'
import type { AuthSession } from '@/types/session'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/property-management/')({
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
  const { isPending, data: propertyManagements } = useQuery<PropertyManagementTab[]>({
    queryKey: ["property-managements"],
    queryFn: () => apiFetch<PropertyManagementTab[]>("/property-management"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='New Rental' url='/dashboard/property-management/new-property' type='url' />
    <PropertyCards />
    <DataTable data={propertyManagements || []} columns={columns} filters={["name", "company"]} isLoading={isPending} />
  </div>
}
