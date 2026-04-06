import EditQuotes from "@/components/forms/quotes/edit";
import Preview from "@/components/forms/quotes/preview";
import Share from "@/components/forms/quotes/share";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@tanstack/react-router";

export default function QuoteTabs({ id }: { id: string }) {
    const search = useSearch({ from: "/dashboard/quotes/edit-quote/$id" });

    return (
        <div>
            <Tabs defaultValue={search.type} className='gap-4 w-full'>
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
                    <EditQuotes id={id} />
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
