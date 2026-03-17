import Customize from "@/assets/icons/settings/customize.png"
import LogoEdit from "@/assets/icons/settings/logo-edit.png"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function Appearance() {
    return (
        <div className="bg-white p-6 rounded-md shadow-md shadow-neutral-300/10">
            <h2 className="font-medium">Apparence du document</h2>
            <Accordion type="single" collapsible defaultValue="item-1" className="py-0">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-green)" >
                                <img src={Customize} alt="Customize" className="size-5 object-contain object-center" />
                            </span>
                            Customise Headers & Footer
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-dark-purple)" >
                                <img src={LogoEdit} alt="Édition du logo" className="size-5 object-contain object-center" />
                            </span>
                            Ajouter un logo
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
