import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { contractSchema, type ContractSchemaType } from "@/lib/zod/contract";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Rental } from "@/types/rental";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";


export default function ContractForm() {
    const [reference, setReference] = useState<string>("");

    const { isPending: isGettingRentals, data: rentals } = useQuery({
        queryKey: ["rentals"],
        queryFn: () => apiFetch<Rental[]>("/rental"),
        select: (data) =>
            data.map((rental) => ({
                value: rental.id,
                label: `${rental.reference}`,
            })),
    });

    const { isPending: isGettingDisabledDates, data: disabledDates } = useQuery({
        queryKey: ["contract", reference],
        enabled: !!reference,
        queryFn: () => apiFetch<[Date, Date][]>(`/contract/disabled?type=CONTRACT&reference=${reference}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
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
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="rental"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Location</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(value) => {
                                            field.onChange(value)
                                            setReference(value)
                                        }
                                        } value={field.value} >
                                            <SelectTrigger className="w-full h-11!" aria-invalid={!!form.formState.errors.rental}>
                                                <SelectValue placeholder="Selectionner une location" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingRentals ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : rentals && rentals.length > 0 ? (
                                                    rentals.map((rental) => (
                                                        <SelectItem key={rental.value} value={rental.value}>
                                                            {rental.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        Aucune location disponible
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-600">Période</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            type="range"
                                            date={field.value}
                                            setDate={field.onChange}
                                            error={!!form.formState.errors.period}
                                            hasIcon
                                            disabled={isGettingDisabledDates || !reference}
                                            disabledRanges={disabledDates}
                                        />
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
