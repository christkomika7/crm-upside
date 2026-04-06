import Filter from "@/components/input/filter";
import DataTable from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";
import { columns } from "@/lib/tables/contract/contract";
import type { ContractTab } from "@/types/contract";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ContractDataTable() {
    const [type, setType] = useState<"WAIT" | "ARCHIVED">("WAIT");
    const [filter, setFilter] = useState<"alpha" | "asc" | "desc">("alpha");

    const { isPending, data: contracts } = useQuery<ContractTab[]>({
        queryKey: ["contracts", type],
        enabled: !!type,
        queryFn: () => apiFetch<ContractTab[]>(`/contract?type=${type}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });
    return (
        <div className="bg-white">
            <Tabs onValueChange={(value) => setType(value === 'ongoing' ? 'WAIT' : 'ARCHIVED')} defaultValue='ongoing' className='gap-x-4 gap-y-0 w-full'>
                <TabsList className='rounded-none px-4 space-x-2 pt-4 pb-0 relative'>
                    <TabsTrigger
                        value="ongoing"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        En cours
                    </TabsTrigger>
                    <TabsTrigger
                        value="archived"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Archivé
                    </TabsTrigger>
                    <div className="flex w-full justify-end">
                        <Filter setFilter={setFilter} filter={filter} />
                    </div>
                </TabsList>
                <span className="flex w-full h-px bg-border" />


                <TabsContent value="ongoing">
                    <DataTable data={contracts || []} columns={columns} filters={["name", "company"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
                <TabsContent value="archived">
                    <DataTable data={contracts || []} columns={columns} filters={["name", "company"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
