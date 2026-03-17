import DataTable from "@/components/table/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { columns as unitColumn, data as unitData } from "@/lib/tables/owner/units"

const tabs = [
    {
        name: 'Unités',
        value: 'units',
        content: (
            <DataTable data={unitData} columns={unitColumn} filters={[]} />
        )
    },
    {
        name: 'Factures',
        value: 'invoices',
        content: (
            <DataTable data={unitData} columns={unitColumn} filters={[]} />
        )
    },
    {
        name: 'Contrats/Mandats',
        value: 'contracts',
        content: (
            <DataTable data={unitData} columns={unitColumn} filters={[]} />
        )
    },
    {
        name: 'Comptabilité',
        value: 'accounting',
        content: (
            <DataTable data={unitData} columns={unitColumn} filters={[]} />
        )
    },
    {
        name: 'Flux de trésorerie',
        value: 'cashflow',
        content: (
            <DataTable data={unitData} columns={unitColumn} filters={[]} />
        )
    }
]

export default function TabDataList() {
    return (
        <div className="bg-white rounded-md shadow-md shadow-neutral-300/10 flex justify-between items-center">
            <Tabs defaultValue='units' className='gap-4 w-full'>
                <TabsList className='rounded-none border-b px-4 pt-4 pb-0 w-full'>
                    {tabs.map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className='bg-background pb-4 text-base font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                        >
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="p-4">
                        <p className='text-muted-foreground text-sm'>{tab.content}</p>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
