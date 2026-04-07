import Customize from "@/assets/icons/settings/customize.png"
import {
    ButtonGroup,
} from "@/components/ui/button-group"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import SaveDefaultText from "@/components/forms/settings/default-text"

export default function DefaultText() {
    const [current, setCurrent] = useState<"invoice" | "quote" | "purchase-order">("invoice");
    return (
        <div className="bg-white p-6 rounded-md shadow-md shadow-neutral-300/10">
            <h2 className="font-medium">Texte par défaut</h2>
            <Accordion type="single" collapsible defaultValue="item-1" className="py-0">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-green)" >
                                <img src={Customize} alt="Personnaliser" className="size-5 object-contain object-center" />
                            </span>
                            Modèles d'email
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                        <SaveDefaultText current={current} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <ButtonGroup className="gap-x-2">
                <Button
                    onClick={() => setCurrent("invoice")}
                    variant={current === "invoice" ? "default" : "outline"}
                    className="rounded-md!"
                >Facture</Button>
                <Button
                    onClick={() => setCurrent("quote")}
                    variant={current === "quote" ? "default" : "outline"}
                    className="rounded-md! border!"
                >Bon de livraison</Button>
                <Button
                    onClick={() => setCurrent("purchase-order")}
                    variant={current === "purchase-order" ? "default" : "outline"}
                    className="rounded-md! border!"
                >Bon de commande</Button>
            </ButtonGroup>
        </div>
    )
}
