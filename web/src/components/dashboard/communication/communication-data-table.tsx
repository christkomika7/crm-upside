import Filter from "@/components/input/filter";
import DataTable from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns, data } from "@/lib/tables/communication/communications";
import { useState } from "react";

export default function CommunicationDataTable() {
    const [filter, setFilter] = useState<"alpha" | "asc" | "desc">("alpha");

    return (
        <div className="bg-white">
            <Tabs defaultValue='letter' className='gap-x-4 gap-y-0 w-full'>
                <TabsList className='rounded-none px-4 space-x-2 pt-4 pb-0 relative'>
                    <TabsTrigger
                        value="letter"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Lettre
                    </TabsTrigger>
                    <TabsTrigger
                        value="note"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Note
                    </TabsTrigger>
                    <div className="flex w-full justify-end">
                        <Filter setFilter={setFilter} filter={filter} />
                    </div>
                </TabsList>
                <span className="flex w-full h-px bg-border" />
                <TabsContent value="letter">
                    <DataTable data={data} columns={columns} filters={["name", "company"]} hasFilter={false} />
                </TabsContent>
                <TabsContent value="note">
                    <DataTable data={data} columns={columns} filters={["name", "company"]} hasFilter={false} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
