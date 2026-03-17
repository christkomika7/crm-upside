import EditInvoices from "@/components/forms/invoices/edit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InvoiceTabs() {
    return (
        <div>
            <Tabs defaultValue='edit' className='gap-4 w-full'>
                <TabsList className="bg-white rounded-md p-1">
                    <TabsTrigger
                        value="edit"
                        className='bg-transparent p-2 text-sm font-medium data-[state=active]:bg-neutral-600 data-[state=active]:text-white h-full rounded-md border-transparent'
                    >
                        Modifier
                    </TabsTrigger>
                    <TabsTrigger
                        className='bg-transparent text-sm p-2 font-medium data-[state=active]:bg-neutral-600 data-[state=active]:text-white h-full rounded-md border-transparent'
                        value="preview"
                    >
                        Visualiser
                    </TabsTrigger>
                    <TabsTrigger
                        className='bg-transparent text-sm p-2 font-medium data-[state=active]:bg-neutral-600 data-[state=active]:text-white h-full rounded-md border-transparent'
                        value="send"
                    >
                        Partager
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="edit">
                    <EditInvoices />
                </TabsContent>
                <TabsContent value="preview">
                    <p className='text-muted-foreground text-sm'>Preview</p>
                </TabsContent>
                <TabsContent value="send">
                    <p className='text-muted-foreground text-sm'>Send</p>
                </TabsContent>
            </Tabs>
        </div>
    )
}
