import ContractTabs from '@/components/dashboard/contract/contract-tabs';
import ActionHeader from '@/components/header/action-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/contracts/edit-contract/$id')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: (search.type as "CONTRACT" | "MANDATE") || "CONTRACT",
      tab: (search.tab as "edit" | "preview" | "share") || "edit",
    };
  },
})

function RouteComponent() {
  return <div className='space-y-6'>
    <ActionHeader />
    <ContractTabs />
  </div>
}
