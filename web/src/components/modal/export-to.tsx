import { Button } from "../ui/button";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { ButtonGroup } from "@/components/ui/button-group"
import { FileTextIcon, SheetIcon } from "lucide-react";


type ExportToProps = {
    title: string;
    children: React.ReactNode
}

export default function ExportTo({ title, children }: ExportToProps) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-80 p-0">
                <div className="space-y-4">
                    <div className="p-4 border-b">
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <div className="px-4 pb-4 space-y-4">
                        <h2 className="text-sm font-medium text-center">Selectionner le format</h2>

                        <div className="flex gap-x-2 px-6 pb-4">
                            <ButtonGroup className="w-full grid grid-cols-2 gap-x-2">
                                <Button variant="wrong" className="rounded-md!"><FileTextIcon className="size-4" />PDF</Button>
                                <Button variant="success" className="rounded-md!"><SheetIcon className="size-4" />Excel</Button>
                            </ButtonGroup>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2">
                            <Button variant="outline-destructive" onClick={() => setOpen(false)} >Annuler</Button>
                            <Button variant="action">Exporter</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
