import Filter from "@/components/input/filter";
import DataTable from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";
import { columns } from "@/lib/tables/invoice/invoice";
import type { InvoiceTab } from "@/types/invoice";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function InvoiceDataTable() {
    const [tab, setTab] = useState<"PAID" | "UNPAID">("UNPAID");
    const [filter, setFilter] = useState<"alpha" | "asc" | "desc">("alpha");

    const { isPending, data: invoices } = useQuery<InvoiceTab[]>({
        queryKey: ["invoices", tab],
        enabled: !!tab,
        queryFn: () => apiFetch<InvoiceTab[]>(`/invoice?type=${tab}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    return (
        <div className="bg-white">
            <Tabs onValueChange={(value) => setTab(value === 'paid' ? 'PAID' : 'UNPAID')} defaultValue='unpaid' className='gap-x-4 gap-y-0 w-full'>
                <TabsList className='rounded-none px-4 space-x-2 pt-4 pb-0 relative'>
                    <TabsTrigger
                        value="unpaid"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Facture impayé
                    </TabsTrigger>
                    <TabsTrigger
                        value="paid"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Facture payé
                    </TabsTrigger>
                    <div className="flex w-full justify-end">

                        <Filter setFilter={setFilter} filter={filter} />
                    </div>
                </TabsList>
                <span className="flex w-full h-px bg-border" />


                <TabsContent value="unpaid">
                    <DataTable data={invoices || []} columns={columns} filters={["reference", "client"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
                <TabsContent value="paid">
                    <DataTable data={invoices || []} columns={columns} filters={["reference", "client"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
