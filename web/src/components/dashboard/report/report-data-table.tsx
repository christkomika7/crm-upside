import Filter from "@/components/input/filter";
import DataTable from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";
import { columns } from "@/lib/tables/report/reports";
import type { ReportTab } from "@/types/report";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ReportDataTable() {
    const [tab, setTab] = useState<"CHECK_IN" | "CHECK_OUT">("CHECK_IN");
    const [filter, setFilter] = useState<"alpha" | "asc" | "desc">("alpha");

    const { isPending, data: reports } = useQuery<ReportTab[]>({
        queryKey: ["reports", tab],
        enabled: !!tab,
        queryFn: () => apiFetch<ReportTab[]>(`/check-in-out?type=${tab}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    return (
        <div className="bg-white">
            <Tabs defaultValue={tab === "CHECK_IN" ? "check-in" : "check-out"} onValueChange={(value) => setTab(value === 'check-in' ? 'CHECK_IN' : 'CHECK_OUT')} className='gap-x-4 gap-y-0 w-full'>
                <TabsList className='rounded-none px-4 space-x-2 pt-4 pb-0 relative'>
                    <TabsTrigger
                        value="check-in"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Entrée
                    </TabsTrigger>
                    <TabsTrigger
                        value="check-out"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Sortie
                    </TabsTrigger>
                    <div className="flex w-full justify-end">

                        <Filter setFilter={setFilter} filter={filter} />
                    </div>
                </TabsList>
                <span className="flex w-full h-px bg-border" />


                <TabsContent value="check-in">
                    <DataTable data={reports || []} columns={columns} filters={["name", "company"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
                <TabsContent value="check-out">
                    <DataTable data={reports || []} columns={columns} filters={["name", "company"]} hasFilter={false} isLoading={isPending} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
