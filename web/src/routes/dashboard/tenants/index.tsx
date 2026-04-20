import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { useApiData } from '@/hooks/use-api-data'
import { canAccess } from '@/lib/permission'
import { columns } from '@/lib/tables/tenant/tenants'
import type { TenantTab } from '@/types/tenant'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tenants/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "tenants", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasCreateAccess = canAccess(permission, "tenants", ['create']);

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
    onSortChange,
  } = useApiData<TenantTab>({ url: "/tenant", key: "tenants" });

  return (
    <div className='space-y-6'>
      <ActionHeader
        title='Ajouter locataire'
        url='/dashboard/tenants/new-tenant'
        type='url'
        showAction={hasCreateAccess}
      />
      <DataTable
        data={data}
        columns={columns}
        filters={["name", "company"]}
        sort="name"
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
        onSortChange={onSortChange}
      />
    </div>
  );
}