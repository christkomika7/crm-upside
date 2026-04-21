import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { rentalSchema, type RentalSchemaType } from "@/lib/zod/rentals";
import { DatePicker } from "@/components/ui/date-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import type { Unit } from "@/types/unit";
import RequiredLabel from "@/components/ui/required-label";
import { DEFAULT_VALUES } from "./lib/utils";
import { SelectField } from "@/components/ui/select-field";
import type { LabelType } from "@/types/utils";
import { furnishedOptions } from "@/lib/data";


export default function CreateRental() {
    const { isPending: isGettingTenant, data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => apiFetch<LabelType[]>("/tenant/list"),
        select: (data) => data.map((tenant) => ({
            value: tenant.value,
            label: tenant.label,
        })),
    });

    const { isPending: isGettingUnits, data: units = [] } = useQuery({
        queryKey: ["valid-units"],
        queryFn: () => apiFetch<Unit[]>(`/unit/valid/`),
        select: (data) =>
            data.map((unit) => ({
                value: unit.id,
                label: unit.reference,
                price: unit.rent,
                charges: unit.charges,
                extrasCharges: unit.extraCharges,
                furnished: unit.furnished
            })),
    });

    const mutation = useMutation({
        mutationFn: (data: RentalSchemaType) =>
            crudService.post<RentalSchemaType, any>("/rental/", data),
        onSuccess() {
            toast.success("Locataire créé avec succès");
            queryClient.invalidateQueries({ queryKey: ["rentals"] });
            form.reset(DEFAULT_VALUES);
            queryClient.invalidateQueries({ queryKey: ["valid-units"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const form = useForm<RentalSchemaType>({
        resolver: zodResolver(rentalSchema),
        defaultValues: DEFAULT_VALUES
    });

    async function submit(formData: RentalSchemaType) {
        const { success, data } = rentalSchema.safeParse(formData);
        if (success) {
            mutation.mutate(data)
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations du loyer</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="tenant"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Nom du locataire"
                                    required
                                    placeholder="Sélectionner un locataire"
                                    value={field.value}
                                    isLoading={isGettingTenant}
                                    onChange={field.onChange}
                                    options={tenants}
                                    hasError={!!formState.errors.tenant}
                                    emptyMessage="Aucun locataire disponible"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Unité"
                                    required
                                    isLoading={isGettingUnits}
                                    placeholder="Sélectionner une unité"
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        const unit = units.find(unit => unit.value === e)
                                        form.setValue("price", `${unit?.price || 0}`);
                                        form.setValue("charges", `${unit?.charges || 0}`);
                                        form.setValue("extrasCharges", `${unit?.extrasCharges || 0}`);
                                        form.setValue("furnished", unit?.furnished)
                                    }}
                                    options={units}
                                    hasError={!!formState.errors.unit}
                                    emptyMessage="Aucune unité disponible"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix du loyer<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            suffix="FCFA"
                                            placeholder="Entrer le prix"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.price}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="charges"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix des charges<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le prix"
                                            suffix="FCFA"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.price}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="extrasCharges"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix des charges ponctuelles<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le prix"
                                            suffix="FCFA"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.price}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="furnished"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Meublé"
                                    required
                                    placeholder="Sélectionner l'état de l'unité"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    options={furnishedOptions}
                                    hasError={!!formState.errors.furnished}
                                    emptyMessage="Aucun état disponible"
                                />

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="start"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date du début<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.start} hasIcon={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date de fin<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.end} hasIcon={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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
