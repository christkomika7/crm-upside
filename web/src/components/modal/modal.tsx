import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "radix-ui";
import type React from "react";

type ModalProps = {
    action?: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    setOpen?: (open: boolean) => void;

}

export default function Modal({ title, action, children, className, open, setOpen }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {action}
            </DialogTrigger>
            <DialogContent className={cn(className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <VisuallyHidden.Root asChild>
                        <DialogDescription />
                    </VisuallyHidden.Root>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
