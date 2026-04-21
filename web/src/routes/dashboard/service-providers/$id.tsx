import ActionHeader from '@/components/header/action-header'
import InfosProviderCards from '@/components/dashboard/service-provider/infos-provider-card'
import ProviderInfos from '@/components/dashboard/service-provider/provider-infos'
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'
import ProviderDataTable from '@/components/dashboard/service-provider/provider-data-table'
import type { User } from '@/types/user'
import { canAccess } from '@/lib/permission'

export const Route = createFileRoute('/dashboard/service-providers/$id')({
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

  const param = useParams({ from: "/dashboard/service-providers/$id" });
  const id = param.id.split("provider-")[1];
  return <div className='space-y-6'>
    <ActionHeader title='Nouveau bon de commande' hasIcon={false} url='/dashboard/service-providers/new-service' type='url' showAction={hasCreateAccess} />
    <ProviderInfos id={id} />
    <InfosProviderCards id={id} />
    <ProviderDataTable id={id} />
  </div>
}
