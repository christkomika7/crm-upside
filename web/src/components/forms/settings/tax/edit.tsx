import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taxSchema, type TaxSchemaType } from "@/lib/zod/settings";
import { Input } from "@/components/ui/input";
import { EditIcon, XIcon } from "lucide-react";
import { crudService } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { type Tax } from "@/types/tax";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";
import { useState } from "react";

type EditTaxProps = {
    tax: Tax;
};


export default function EditTax({ tax }: EditTaxProps) {
    const [currentTax, setCurrentTax] = useState<Tax | null>(null);
    const form = useForm<TaxSchemaType>({
        resolver: zodResolver(taxSchema),
        defaultValues: {
            name: tax.name,
            rate: tax.value,
        },
    });


    const editTax = useMutation({
        mutationFn: ({ taxId, data }: { taxId: string, data: TaxSchemaType }) =>
            crudService.put(`/tax/${taxId}`, data),
        onSuccess() {
            toast.success("Taxe modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeTax = useMutation({
        mutationFn: ({ taxId }: { taxId: string }) =>
            crudService.delete(`/tax/${taxId}`),
        onSuccess() {
            toast.success("Taxe supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    async function submit(formData: TaxSchemaType) {
        const { success, data } = taxSchema.safeParse(formData);
        if (success && currentTax?.id) {
            editTax.mutate({ taxId: currentTax.id, data });
        }
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-2.5 w-full"
            >
                <div className="flex gap-x-2.5 py-2 pl-1">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nom de la taxe"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.name}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Taux de la taxe"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.rate}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="max-w-sm flex gap-x-2">
                        <Button onClick={() => setCurrentTax(tax)} disabled={editTax.isPending} type="submit" variant="action" className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30">
                            {editTax.isPending ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                <EditIcon className="size-4" />
                            )}
                        </Button>
                        <Button onClick={() => removeTax.mutate({ taxId: tax.id })} disabled={removeTax.isPending} type="submit" variant="destructive" className="size-10! px-0! bg-destructive/15 text-destructive hover:bg-destructive/30">
                            {removeTax.isPending ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                <XIcon className="size-4" />
                            )}
                        </Button>


                    </div>
                </div>
            </form>
        </Form>
    )
}
