import Filter from "@/components/input/filter";
import DataTable from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";
import { columns } from "@/lib/tables/quote/quote";
import type { QuoteTab } from "@/types/quote";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function QuoteDataTable() {
    const [type, setType] = useState<"COMPLETE" | "WAIT">("WAIT");
    const [filter, setFilter] = useState<"alpha" | "asc" | "desc">("alpha");

    const { isPending, data: quotes } = useQuery<QuoteTab[]>({
        queryKey: ["quotes", type],
        queryFn: () => apiFetch<QuoteTab[]>(`/quote?type=${type}`),
    });

    return (
        <div className="bg-white">
            <Tabs onValueChange={(value) => setType(value === 'complete' ? 'COMPLETE' : 'WAIT')} defaultValue='wait' className='gap-x-4 gap-y-0 w-full'>
                <TabsList className='rounded-none px-4 space-x-2 pt-4 pb-0 relative'>
                    <TabsTrigger
                        value="wait"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Devis en attente
                    </TabsTrigger>
                    <TabsTrigger
                        value="complete"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Devis facturés
                    </TabsTrigger>
                    <div className="flex w-full justify-end">
                        <Filter setFilter={setFilter} filter={filter} />
                    </div>
                </TabsList>
                <span className="flex w-full h-px bg-border" />


                <TabsContent value="wait">
                    <DataTable data={quotes || []} columns={columns} filters={["reference", "client"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
                <TabsContent value="complete">
                    <DataTable data={quotes || []} columns={columns} filters={["reference", "client"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
