import Appearance from '@/components/dashboard/settings/appearance'
import DefaultText from '@/components/dashboard/settings/default-text'
import ManageDeletion from '@/components/dashboard/settings/manage-deletion'
import ReferenceText from '@/components/dashboard/settings/reference-text'
import Taxes from '@/components/dashboard/settings/taxes'
import UserManagement from '@/components/dashboard/settings/user-management'
import { canAccess } from '@/lib/permission'
import type { User } from '@/types/user'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings/')({
  beforeLoad: ({ context }) => {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, 'settings', ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
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
