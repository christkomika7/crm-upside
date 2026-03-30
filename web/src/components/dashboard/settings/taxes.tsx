import Customize from "@/assets/icons/settings/customize.png"
import LogoEdit from "@/assets/icons/settings/logo-edit.png"
import CreateTax from "@/components/forms/settings/tax/create"
import ListTax from "@/components/forms/settings/tax/list"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function Taxes() {
    return (
        <div className="bg-white p-6 rounded-md shadow-md shadow-neutral-300/10">
            <h2 className="font-medium">Taxes</h2>
            <Accordion type="single" collapsible defaultValue="item-1" className="py-0">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-green)" >
                                <img src={Customize} alt="Personnaliser" className="size-5 object-contain object-center" />
                            </span>
                            Gérer la TVA & TSS
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ListTax />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger >
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-dark-purple)" >
                                <img src={LogoEdit} alt="Éditer le logo" className="size-5 object-contain object-center" />
                            </span>
                            Créer une nouvelle taxe
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CreateTax />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
