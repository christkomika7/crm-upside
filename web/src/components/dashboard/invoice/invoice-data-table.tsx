import Filter from "@/components/input/filter";
import DataTable from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";
import { columns } from "@/lib/tables/invoice/invoice";
import type { InvoiceTab } from "@/types/invoice";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function InvoiceDataTable() {
    const [type, setType] = useState<"PAID" | "UNPAID">("PAID");
    const [filter, setFilter] = useState<"alpha" | "asc" | "desc">("alpha");

    const { isPending, data: invoices } = useQuery<InvoiceTab[]>({
        queryKey: ["invoices", type],
        queryFn: () => apiFetch<InvoiceTab[]>(`/invoice?type=${type}`),
    });

    return (
        <div className="bg-white">
            <Tabs onValueChange={(value) => setType(value === 'paid' ? 'PAID' : 'UNPAID')} defaultValue='paid' className='gap-x-4 gap-y-0 w-full'>
                <TabsList className='rounded-none px-4 space-x-2 pt-4 pb-0 relative'>
                    <TabsTrigger
                        value="paid"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Facture payé
                    </TabsTrigger>
                    <TabsTrigger
                        value="unpaid"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Facture impayé
                    </TabsTrigger>
                    <div className="flex w-full justify-end">

                        <Filter setFilter={setFilter} filter={filter} />
                    </div>
                </TabsList>
                <span className="flex w-full h-px bg-border" />


                <TabsContent value="paid">
                    <DataTable data={invoices || []} columns={columns} filters={["reference", "client"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
                <TabsContent value="unpaid">
                    <DataTable data={invoices || []} columns={columns} filters={["reference", "client"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
