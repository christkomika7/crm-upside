import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

type StatementModalProps = {
    title: string;
    hasIcon?: boolean
}

const tabs = [
    {
        name: 'Nouveau',
        value: 'create',
        content: (
            <>Hello world</>
        )
    },
    {
        name: 'Visualiser',
        value: 'preview',
        content: (
            <>Hello world</>
        )
    },
    {
        name: 'Partager',
        value: 'send',
        content: (
            <>Hello world</>
        )
    }
]

export default function StatementModal({ title, hasIcon = false }: StatementModalProps) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="action" className="w-fit"> {hasIcon && <PlusIcon className="size-3.5" />} {title}</Button>
            </DialogTrigger>
            <DialogContent className="w-auto p-0">
                <div>
                    <div className="p-4">
                        <h2 className="font-semibold">Statement</h2>
                    </div>

                    <Tabs defaultValue='units' className='gap-4 w-full'>
                        <TabsList className='rounded-none border-b px-4 pt-4 pb-0 w-full'>
                            {tabs.map(tab => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className='bg-background pb-4  text-sm font-medium data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
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
            </DialogContent>
        </Dialog>
    )
}
