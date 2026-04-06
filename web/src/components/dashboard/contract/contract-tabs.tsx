import EditContractForm from "@/components/forms/contracts/_components/edit-contract-form";
import EditMandateForm from "@/components/forms/contracts/_components/edit-mandate-form";
import Preview from "@/components/forms/contracts/preview";
import Share from "@/components/forms/contracts/share";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearch } from "@tanstack/react-router";
import { Activity } from "react";

export default function ContractTabs() {
    const search = useSearch({ from: "/dashboard/contracts/edit-contract/$id" });
    const param = useParams({ from: "/dashboard/contracts/edit-contract/$id" })
    const id = param.id.split("edit_contract-")[1];

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
                    <Activity mode={search.type === "CONTRACT" ? "visible" : "hidden"}>
                        <EditContractForm id={id} />
                    </Activity>
                    <Activity mode={search.type === "CONTRACT" ? "hidden" : "visible"}>
                        <EditMandateForm id={id} />
                    </Activity>
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
