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
import { Activity, useEffect, useState } from "react";
import type { Contract } from "@/types/contract";
import { DatePicker } from "@/components/ui/date-picker";
import { isSameRangeDate } from "@/lib/utils";

type EditContractFormProps = {
    id: string
}

export default function EditContractForm({ id }: EditContractFormProps) {
    const [reference, setReference] = useState<string>("");
    const [disabledDates, setDisabledDates] = useState<[Date, Date][]>([]);
    const [current, setCurrent] = useState<[Date, Date]>();
    const [isAlreadyExist, setIsAlreadyExist] = useState(true);

    const { isPending: isGettingContract, data: contract } = useQuery({
        queryKey: ["contract", id],
        enabled: !!id,
        queryFn: () => apiFetch<Contract>(`/contract/${id}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const { isPending: isGettingRentals, data: rentals } = useQuery({
        queryKey: ["rentals"],
        queryFn: () => apiFetch<Rental[]>("/rental"),
        select: (data) =>
            data.map((rental) => ({
                value: rental.id,
                label: `${rental.reference}`,
            })),
    });

    const { isPending: isGettingDisabledDates } = useQuery({
        queryKey: ["contract", reference, id],
        enabled: !!reference && !!id,
        queryFn: async () => {
            const result = await apiFetch<[Date, Date][]>(`/contract/disabled/${id}?type=CONTRACT&reference=${reference}`);
            setDisabledDates(result)
            return result
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });


    const mutation = useMutation({
        mutationFn: ({ contractId, data }: { data: ContractSchemaType, contractId: string }) =>
            crudService.put<ContractSchemaType, any>(`/contract/${contractId}`, data),
        onSuccess() {
            toast.success("Contrat modifié avec succès.");
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            setIsAlreadyExist(true)
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

    useEffect(() => {
        if (contract) {
            setReference(contract?.rentalId || "");
            setDisabledDates(contract?.disabled || [])
            setCurrent([new Date(contract.start), new Date(contract.end)])
            form.reset({
                rental: contract.rentalId,
                type: contract.type,
                period: {
                    from: new Date(contract.start),
                    to: new Date(contract.end)
                }
            })
        }
    }, [contract])

    async function submit(formData: ContractSchemaType) {
        const { success, data } = contractSchema.safeParse(formData);
        if (success && contract?.id) {
            mutation.mutate({
                contractId: contract.id, data: {
                    ...data,
                    period: {
                        from: new Date(data.period.from),
                        to: new Date(data.period.to),
                    }
                }
            });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Modification du contrat</h2>
            <Activity mode={isGettingContract ? 'visible' : "hidden"}>
                <Spinner />
            </Activity>
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
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                setReference(value)
                                            }}
                                            value={field.value} >
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
                                            setDate={(e) => {
                                                field.onChange(e);
                                                if (e?.from && e.to && current) {
                                                    setIsAlreadyExist(isSameRangeDate(current, [e.from, e.to]))
                                                }
                                            }}
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
                        <Button disabled={mutation.isPending || isAlreadyExist} type="submit" variant="action" className="max-w-xl h-11">
                            {mutation.isPending ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                "Modifier"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
