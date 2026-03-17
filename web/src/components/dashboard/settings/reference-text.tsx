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
import SaveDefaultReferenceText from "@/components/forms/settings/default-reference-text";

export default function ReferenceText() {
    const [current, setCurrent] = useState<"owner" | "building" | "unit" | "rental" | "invoicing" | "contract" | "checkIn">("owner");
    return (
        <div className="bg-white p-6 rounded-md shadow-md shadow-neutral-300/10">
            <h2 className="font-medium">Référence par défaut</h2>
            <Accordion type="single" collapsible defaultValue="item-1" className="py-0">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-green)" >
                                <img src={Customize} alt="Personnaliser" className="size-5 object-contain object-center" />
                            </span>
                            Modèle de référence
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                        <SaveDefaultReferenceText current={current} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <ButtonGroup className="gap-x-2">
                <Button
                    onClick={() => setCurrent("owner")}
                    variant={current === "owner" ? "default" : "outline"}
                    className="rounded-md!"
                >Propriétaire</Button>
                <Button
                    onClick={() => setCurrent("building")}
                    variant={current === "building" ? "default" : "outline"}
                    className="rounded-md! border!"
                >Bâtiment</Button>
                <Button
                    onClick={() => setCurrent("unit")}
                    variant={current === "unit" ? "default" : "outline"}
                    className="rounded-md!"
                >Unité</Button>
                <Button
                    onClick={() => setCurrent("rental")}
                    variant={current === "rental" ? "default" : "outline"}
                    className="rounded-md! border!"
                >Location</Button>
                <Button
                    onClick={() => setCurrent("invoicing")}
                    variant={current === "invoicing" ? "default" : "outline"}
                    className="rounded-md!"
                >Facturation</Button>
                <Button
                    onClick={() => setCurrent("contract")}
                    variant={current === "contract" ? "default" : "outline"}
                    className="rounded-md! border!"
                >Contrat</Button>
                <Button
                    onClick={() => setCurrent("checkIn")}
                    variant={current === "checkIn" ? "default" : "outline"}
                    className="rounded-md!"
                >Mouvement</Button>
            </ButtonGroup>
        </div>
    )
}
