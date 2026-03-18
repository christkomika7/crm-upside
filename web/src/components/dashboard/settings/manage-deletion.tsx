import Customize from "@/assets/icons/settings/customize.png"
import DeletionList from "@/components/forms/settings/deletion/deletion-list"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function ManageDeletion() {
    return (
        <div className="bg-white p-6 rounded-md shadow-md shadow-neutral-300/10">
            <h2 className="font-medium">Suppression définitive</h2>
            <Accordion type="single" collapsible defaultValue="item-1" className="py-0">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-green)" >
                                <img src={Customize} alt="Personnaliser" className="size-5 object-contain object-center" />
                            </span>
                            Gérer la suppression
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 space-y-2">
                        <DeletionList />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
