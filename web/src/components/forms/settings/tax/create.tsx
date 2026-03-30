import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taxSchema, type TaxSchemaType } from "@/lib/zod/settings";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import type { Tax } from "@/types/tax";
import MultipleSelector from "@/components/ui/mullti-select";


export default function CreateTax() {
    const form = useForm<TaxSchemaType>({
        resolver: zodResolver(taxSchema),
        defaultValues: {
            cumul: [],
            name: "",
            rate: "",
        }
    });

    const { isPending, data: taxes } = useQuery({
        queryKey: ["taxes"],
        queryFn: () => apiFetch<Tax[]>("/tax"),
        select(data) {
            return data.map((tax) => ({
                value: tax.id,
                label: tax.name,
                rate: tax.value
            }));
        },
    });

    const mutation = useMutation({
        mutationFn: (data: TaxSchemaType) =>
            crudService.post<TaxSchemaType, any>("/tax/create", data),
        onSuccess() {
            toast.success("Tax créée avec succès");
            form.reset({
                name: "",
                rate: "",
                cumul: [],
            });
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    async function submit(formData: TaxSchemaType) {
        const { success, data, error } = taxSchema.safeParse(formData);
        console.log({ error })
        if (success) {
            mutation.mutate(data);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-2.5 w-full relative"
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
                                        suffix="%"
                                        min={-100}
                                        max={100}
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
                    <FormField
                        control={form.control}
                        name="cumul"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <MultipleSelector
                                        isGettingData={isPending}
                                        commandProps={{
                                            label: 'Cumul'
                                        }}
                                        value={
                                            field.value?.map((item) => ({
                                                value: item.id,
                                                label: item.name,
                                                rate: item.rate,
                                            })) ?? []
                                        }
                                        onChange={(options) => {
                                            field.onChange(options.map((opt) => ({
                                                id: opt.value,
                                                name: opt.label,
                                                rate: opt.rate,
                                            })))
                                        }}
                                        defaultOptions={taxes}
                                        placeholder='Cumul avec'
                                        hideClearAllButton
                                        hidePlaceholderWhenSelected
                                        emptyIndicator={<p className='text-center text-sm'>Aucune taxe sélectionnée</p>}
                                        className='w-full'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="max-w-sm">
                        <Button disabled={mutation.isPending} type="submit" variant="action" className="max-w-xl h-10!">
                            {mutation.isPending ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
