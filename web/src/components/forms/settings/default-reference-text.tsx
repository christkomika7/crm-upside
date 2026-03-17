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
    current: "owner" | "building" | "unit" | "rental" | "invoicing" | "contract" | "checkIn";
}

export default function SaveDefaultReferenceText({ current }: SaveDefaultTextProps) {

    const { isPending, data: note } = useQuery<ReferenceSchemaType>({
        queryKey: ["reference"],
        queryFn: () => apiFetch<ReferenceSchemaType>("/reference"),
    });

    const form = useForm<ReferenceSchemaType>({
        resolver: zodResolver(referenceSchema),
        defaultValues: {
            owner: "",
            building: "",
            unit: "",
            rental: "",
            invoicing: "",
            contract: "",
            checkIn: "",
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
                owner: note.owner,
                building: note.building,
                unit: note.unit,
                rental: note.rental,
                invoicing: note.invoicing,
                contract: note.contract,
                checkIn: note.checkIn,
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
                <Activity mode={current === "owner" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="owner"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence du propriétaire</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Référence"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.owner}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "building" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="building"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence du bâtiment</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Référence"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.building}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "unit" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence de l'unité</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Référence"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.unit}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "rental" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="rental"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence de la location</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Référence"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.rental}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "invoicing" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="invoicing"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence de la facturation</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Référence"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.invoicing}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "contract" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="contract"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence du contrat</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Référence"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.contract}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Activity>
                <Activity mode={current === "checkIn" ? "visible" : "hidden"}>
                    <FormField
                        control={form.control}
                        name="checkIn"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence des mouvements</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Référence"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.checkIn}
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
