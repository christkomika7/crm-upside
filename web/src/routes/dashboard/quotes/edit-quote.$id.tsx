import QuoteTabs from '@/components/dashboard/quote/quote-tabs'
import ActionHeader from '@/components/header/action-header'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/quotes/edit-quote/$id')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: (search.type as string) || "edit",
    };
  },
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/quotes/edit-quote/$id" })
  const id = param.id.split("quote-")[1];
  return <div className='space-y-6'>
    <ActionHeader />
    <QuoteTabs id={id} />
  </div>
}
