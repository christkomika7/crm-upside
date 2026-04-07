import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect } from "react"
import { useForm } from "react-hook-form";
import { referenceSchema, type ReferenceSchemaType } from "@/lib/zod/settings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Input } from "@/components/ui/input";

type SaveDefaultTextProps = {
    current: "invoice" | "quote" | "purchase-order";
}

export default function SaveDefaultReferenceText({ current }: SaveDefaultTextProps) {

    const { isPending, data: note } = useQuery<ReferenceSchemaType>({
        queryKey: ["reference"],
        queryFn: () => apiFetch<ReferenceSchemaType>("/reference"),
    });

    const form = useForm<ReferenceSchemaType>({
        resolver: zodResolver(referenceSchema),
        defaultValues: {
            invoice: "",
            quote: "",
            purchaseOrder: "",
        }
    });

    const editReference = useMutation({
        mutationFn: ({ data }: { data: ReferenceSchemaType }) =>
            crudService.put(`/reference`, data),
        onSuccess() {
            toast.success("Référence modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["reference"] });
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

    async function submit(formData: ReferenceSchemaType) {
        const { success, data } = referenceSchema.safeParse(formData);
        if (success) {
            editReference.mutate({ data });
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
                                <FormLabel className="text-neutral-600">Référence de la facture</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: INV-001"
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
                                <FormLabel className="text-neutral-600">Référence du devis</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: DEV-001"
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
                                <FormLabel className="text-neutral-600">Référence du bon de commande</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: PO-001"
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
                    <Button disabled={editReference.isPending} type="submit" variant="action" className="max-w-xl h-11">
                        {editReference.isPending ? (
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
