import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contractSchema, type ContractSchemaType } from "@/lib/zod/contract";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Rental } from "@/types/rental";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { SelectField } from "@/components/ui/select-field";


export default function ContractForm() {

    const { isPending: isGettingRentals, data: rentals } = useQuery({
        queryKey: ["rentals"],
        queryFn: () => apiFetch<Rental[]>("/rental/list"),
        select: (data) =>
            data.map((rental) => ({
                value: rental.id,
                label: `${rental.unit.reference} - ${rental.tenant.firstname} ${rental.tenant.lastname}`,
            })),
    });


    const mutation = useMutation({
        mutationFn: (data: ContractSchemaType) =>
            crudService.post<ContractSchemaType, any>("/contract", data),
        onSuccess() {
            toast.success("Contrat créé avec succès.");
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            form.reset({
                rental: "",
                type: "CONTRACT",
                period: undefined,
            });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });


    const form = useForm<ContractSchemaType>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            rental: "",
            type: "CONTRACT",
            period: undefined,
        }
    });

    async function submit(formData: ContractSchemaType) {
        const { success, data } = contractSchema.safeParse(formData);
        if (success) {
            mutation.mutate(data);
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations sur le contrat</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <FormField
                        control={form.control}
                        name="rental"
                        render={({ field, formState }) => (
                            <SelectField
                                label="Location"
                                required
                                placeholder="Sélectionner une location"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                options={rentals}
                                isLoading={isGettingRentals}
                                hasError={!!formState.errors.rental}
                                emptyMessage="Aucune location disponible"
                            />
                        )}
                    />
                    <div className="flex justify-center">
                        <Button disabled={mutation.isPending} type="submit" variant="action" className="max-w-xl h-11">
                            {mutation.isPending ? (
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
        </div>
    )
}
