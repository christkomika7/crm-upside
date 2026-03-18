import Appearance from '@/components/dashboard/settings/appearance'
import DefaultText from '@/components/dashboard/settings/default-text'
import ManageDeletion from '@/components/dashboard/settings/manage-deletion'
import ReferenceText from '@/components/dashboard/settings/reference-text'
import Taxes from '@/components/dashboard/settings/taxes'
import UserManagement from '@/components/dashboard/settings/user-management'
import { hasAccess } from '@/types/permissions'
import type { AuthSession } from '@/types/session'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings/')({
  beforeLoad({ context }) {
    const session = context.session as AuthSession;
    const settings = session.data?.user.permission?.permissions.settings;
    const access = hasAccess(
      !!context.session?.data?.user,
      settings as unknown as string[],
    );

    if (!access) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='space-y-6'>
    <h2 className='font-bold text-lg'>Paramètres</h2>
    <Appearance />
    <DefaultText />
    <ReferenceText />
    <Taxes />
    <UserManagement />
    <ManageDeletion />
  </div>
}
