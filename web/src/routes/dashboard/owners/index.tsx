import ActionHeader from '@/components/header/action-header'
import DataTable from '@/components/table/data-table'
import { apiFetch } from '@/lib/api'
import { canAccess } from '@/lib/permission'
import { columns } from '@/lib/tables/owner/owners'
import type { Owner } from '@/types/owner'
import type { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { useState, useCallback } from 'react'

export const Route = createFileRoute('/dashboard/owners/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "owners", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
  component: RouteComponent,
})

type FilterType = "alpha" | "asc" | "desc";

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const permission = (session.data?.user as unknown as User).permission?.permissions;
  const hasCreateAccess = canAccess(permission, "owners", ['create']);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("alpha");

  const queryParams = new URLSearchParams({
    page: String(page + 1),
    search,
    sort: filter,
  });

  const { isPending, data } = useQuery<{ data: Owner[]; total: number; pageCount: number }>({
    queryKey: ["owners", page, search, filter],
    queryFn: () => apiFetch(`/owner?${queryParams.toString()}`),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(0);
  }, []);

  const handleFilterChange = useCallback((value: FilterType) => {
    setFilter(value);
    setPage(0);
  }, []);

  return (
    <div className='space-y-6'>
      <ActionHeader title='Nouveau propriétaire' url='/dashboard/owners/new-owner' type='url' showAction={hasCreateAccess} />
      <DataTable
        data={data?.data || []}
        columns={columns}
        filters={["reference", "name"]}
        isLoading={isPending}
        serverSide
        total={data?.total ?? 0}
        pageCount={data?.pageCount ?? 0}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={handleSearchChange}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}