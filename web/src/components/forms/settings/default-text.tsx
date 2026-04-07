import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect } from "react"
import { useForm } from "react-hook-form";
import { noteSchema, type NoteSchemaType } from "@/lib/zod/settings";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";

type SaveDefaultTextProps = {
    current: "invoice" | "quote" | "purchase-order"
}

export default function SaveDefaultText({ current }: SaveDefaultTextProps) {

    const { isPending, data: note } = useQuery<NoteSchemaType>({
        queryKey: ["note"],
        queryFn: () => apiFetch<NoteSchemaType>("/note"),
    });

    const form = useForm<NoteSchemaType>({
        resolver: zodResolver(noteSchema),
    });

    const editNote = useMutation({
        mutationFn: ({ data }: { data: NoteSchemaType }) =>
            crudService.put(`/note`, data),
        onSuccess() {
            toast.success("Note modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["note"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (note) {
            form.reset({
                invoice: note.invoice,
                quote: note.quote,
                purchaseOrder: note.purchaseOrder,
            });
        }
    }, [note]);

    async function submit(formData: NoteSchemaType) {
        const { success, data } = noteSchema.safeParse(formData);
        if (success) {
            editNote.mutate({ data });
        }
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spinner />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-2.5 w-full"
            >
                <Activity mode={current === "invoice" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="invoice"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Note de la facture</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Note"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.invoice}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "quote" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="quote"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Note du devis</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Note"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.quote}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "purchase-order" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="purchaseOrder"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Note du bon de commande</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Note"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.purchaseOrder}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <div className="max-w-sm">
                    <Button disabled={editNote.isPending} type="submit" variant="action" className="max-w-xl h-11">
                        {editNote.isPending ? (
                            <span className="flex justify-center items-center">
                                <Spinner />
                            </span>
                        ) : (
                            "Enregistrer"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
