import Brochure from '@/components/dashboard/unit/brochure'
import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { useApiData } from '@/hooks/use-api-data'
import { canAccess } from '@/lib/permission'
import { columns } from '@/lib/tables/unit/units'
import type { Units } from '@/types/unit'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/units/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "units", ['read']);
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
  const hasCreateAccess = canAccess(permission, "units", ['create']);
  const hasReadAccess = canAccess(permission, "units", ['read']);

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
  } = useApiData<Units>({ url: "/unit", key: "units" });

  console.log({ data })

  return <div className='space-y-6'>
    <div className='space-y-6'>
      <ActionHeader
        title='Nouvelle unité'
        url='/dashboard/units/new-unit'
        type='url'
        secondComponent={<Brochure />}
        showAction={hasCreateAccess}
        showSecond={hasReadAccess}
      />
      <DataTable
        data={data}
        columns={columns}
        filters={["reference", "building", "owner", "tenant"]}
        sort="reference"
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
      {hasCreateAccess && (
        <div className='flex justify-center'>
          <Button variant="inset-action" className='max-w-md'>Envoyer un mail</Button>
        </div>
      )}
    </div>
  </div>
}
