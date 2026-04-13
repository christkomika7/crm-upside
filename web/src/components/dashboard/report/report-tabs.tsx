import EditReport from "@/components/forms/reports/edit";
import Preview from "@/components/forms/reports/preview";
import Share from "@/components/forms/reports/share";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearch } from "@tanstack/react-router";

export default function ReportTabs() {
    const search = useSearch({ from: "/dashboard/reports/edit-report/$id" });
    const param = useParams({ from: "/dashboard/reports/edit-report/$id" })
    const id = param.id.split("edit_report-")[1];
    return (
        <div>
            <Tabs defaultValue={search.tab} className='gap-4 w-full'>
                <TabsList className="bg-white rounded-md p-1">
                    <TabsTrigger
                        value="edit"
                        className='bg-transparent p-2 text-sm font-medium data-[state=active]:bg-emerald-background data-[state=active]:text-white h-full rounded-md border-transparent'
                    >
                        Modifier
                    </TabsTrigger>
                    <TabsTrigger
                        className='bg-transparent text-sm p-2 font-medium data-[state=active]:bg-emerald-background data-[state=active]:text-white h-full rounded-md border-transparent'
                        value="preview"
                    >
                        Visualiser
                    </TabsTrigger>
                    <TabsTrigger
                        className='bg-transparent text-sm p-2 font-medium data-[state=active]:bg-emerald-background data-[state=active]:text-white h-full rounded-md border-transparent'
                        value="share"
                    >
                        Partager
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="edit">
                    <EditReport id={id} />
                </TabsContent>
                <TabsContent value="preview">
                    <Preview id={id} />
                </TabsContent>
                <TabsContent value="share">
                    <Share id={id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
