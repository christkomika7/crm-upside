import RentalCards from '@/components/dashboard/rental/rental-cards'
import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { columns } from '@/lib/tables/rental/rentals'
import type { Rental } from '@/types/rental'
import { useQuery } from '@tanstack/react-query'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/rentals/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "rentals", ['read']);
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
  const hasCreateAccess = canAccess(permission, "rentals", ['create']);
  const { isPending, data: rentals } = useQuery<Rental[]>({
    queryKey: ["rentals"],
    queryFn: () => apiFetch<Rental[]>("/rental"),
  });

  return <div className='space-y-6'>
    <ActionHeader title='Nouvelle location' url='/dashboard/rentals/new-rental' type='url' showAction={hasCreateAccess} />
    <RentalCards />
    <DataTable data={rentals || []} columns={columns} filters={['']} sort='tenant' isLoading={isPending} />
  </div>
}
