import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { useApiData } from '@/hooks/use-api-data'
import { canAccess } from '@/lib/permission'
import { columns } from '@/lib/tables/building/buildings'
import type { Building } from '@/types/building'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/buildings/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "buildings", ['read']);
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
  const hasCreateAccess = canAccess(permission, "buildings", ['create']);

  const {
    data,
    total,
    pageCount,
    page,
    search,
    filter,
    isPending,
    onPageChange,
    onSearchChange,
    onFilterChange,
  } = useApiData<Building>({ url: "/building", key: "buildings" });

  return <div className='space-y-6'>
    <div className='space-y-6'>
      <ActionHeader title='Nouveau bâtiments' url='/dashboard/buildings/new-building' type='url'
        showAction={hasCreateAccess}
      />
      <DataTable
        data={data}
        columns={columns}
        filters={["reference"]}
        sort="date"
        placeholder="Rechercher"
        isLoading={isPending}
        serverSide={true}
        total={total}
        pageCount={pageCount}
        page={page}
        onPageChange={onPageChange}
        search={search}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={onFilterChange}
      />
    </div>
  </div>
}
