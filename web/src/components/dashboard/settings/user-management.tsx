import Customize from "@/assets/icons/settings/customize.png"
import LogoEdit from "@/assets/icons/settings/logo-edit.png"
import CreateUser from "@/components/forms/settings/user/create"
import ListUser from "@/components/forms/settings/user/list"
import SetPermissions from "@/components/forms/settings/user/set-permissions"
import Modal from "@/components/modal/modal"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

export default function UserManagement() {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white p-6 rounded-md shadow-md shadow-neutral-300/10">
            <h2 className="font-medium">Gestion des utilisateurs</h2>
            <Accordion type="single" collapsible defaultValue="item-1" className="py-0">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-green)" >
                                <img src={Customize} alt="Personnaliser" className="size-5 object-contain object-center" />
                            </span>
                            Comptes Utilisateur
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 space-y-2">
                        <ListUser />
                        <Modal open={open} setOpen={setOpen} title="Nouvel utilisateur" action={<Button variant="action" className="w-fit"><PlusIcon className="size-4" /> Ajouter un utilisateur</Button>} >
                            <CreateUser close={setOpen} />
                        </Modal>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <h3 className="flex items-center gap-x-2 text-sm font-medium">
                            <span className="p-2 size-9 flex justify-center items-center rounded-full bg-(--card-dark-purple)" >
                                <img src={LogoEdit} alt="Logo Edit" className="size-5 object-contain object-center" />
                            </span>
                            Gestion des permissions
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-2">
                        <SetPermissions />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
