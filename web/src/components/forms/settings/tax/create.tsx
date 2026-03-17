import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taxSchema, type TaxSchemaType } from "@/lib/zod/settings";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";


export default function CreateTax() {
    const form = useForm<TaxSchemaType>({
        resolver: zodResolver(taxSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: TaxSchemaType) =>
            crudService.post<TaxSchemaType, any>("/tax/create", data),
        onSuccess() {
            toast.success("Tax créée avec succès");
            form.reset({
                name: "",
                rate: "",
            });
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    async function submit(formData: TaxSchemaType) {
        const { success, data } = taxSchema.safeParse(formData);
        if (success) {
            mutation.mutate(data);
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
                                        type="text"
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
