import DataTable from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns, data } from "@/lib/tables/appointment/appointments";

export default function AppointmentDataTable() {
    return (
        <div className="bg-white">
            <Tabs defaultValue='upcoming' className='gap-x-4 gap-y-0 w-full'>
                <TabsList className='rounded-none px-4 space-x-2 pt-4 pb-0 relative'>
                    <TabsTrigger
                        value="upcoming"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Rendez-vous à venir
                    </TabsTrigger>
                    <TabsTrigger
                        value="past"
                        className='bg-background p-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                    >
                        Rendez-vous passés
                    </TabsTrigger>
                </TabsList>
                <span className="flex w-full h-px bg-border" />
                <TabsContent value="upcoming">
                    <DataTable data={data} columns={columns} filters={["name", "company"]} hasFilter={false} />
                </TabsContent>
                <TabsContent value="past">
                    <DataTable data={data} columns={columns} filters={["name", "company"]} hasFilter={false} />
                </TabsContent>
            </Tabs>
        </div>

    )
}
