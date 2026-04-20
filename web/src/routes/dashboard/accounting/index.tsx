import AccountingCards from '@/components/dashboard/accounting/accounting-cards'
import ActionHeader from '@/components/header/action-header'
import ExportTo from '@/components/modal/export-to'
import DataTable from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useApiData } from '@/hooks/use-api-data'
import { canAccess } from '@/lib/permission'
import { columns } from '@/lib/tables/accounting/accounting'
import type { AccountingTab } from '@/types/accounting'
import type { User } from '@/types/user'
import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/accounting/')({
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "accounting", ['read']);
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
  const hasCreateAccess = canAccess(permission, "accounting", ['create']);
  const hasReadAccess = canAccess(permission, "accounting", ['read']);

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
  } = useApiData<AccountingTab>({ url: "/accounting", key: "accountings" });

  return <div className='space-y-6'>
    <ActionHeader type='modal'
      showComponent={hasCreateAccess}
      showSecond={hasReadAccess}
      component={
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="action" className='w-fit'>Nouvelle entrée</Button>
          </PopoverTrigger>
          <PopoverContent align="end" side="bottom" className="w-52 p-0">
            <PopoverArrow />
            <ul className=" text-sm text-neutral-600">
              <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center" >
                <Link className='w-full h-full' to="/dashboard/accounting/new-accounting" search={{ type: "income" }}>
                  Ajouter une entrée
                </Link>
              </li>
              <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">
                <Link className='w-full h-full' to="/dashboard/accounting/new-accounting" search={{ type: "outcome" }}>
                  Ajouter une sortie
                </Link>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      } secondComponent={<ExportTo title="Exporter" >
        <Button variant="inset-action" className="w-fit">Exporter</Button>
      </ExportTo>} />
    <AccountingCards />
    <DataTable
      data={data}
      columns={columns}
      filters={["unit", "category", "nature", "secondNature", "thirdNature", "allocation", "source"]}
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
}
