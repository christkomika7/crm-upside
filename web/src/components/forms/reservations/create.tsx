import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { reservationSchema, type ReservationSchemaType } from "@/lib/zod/reservations";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Unit } from "@/types/unit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";


export default function CreateReservation() {
    const { isPending: isGettingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: () => apiFetch<Unit[]>("/unit/"),
        select: (data) => data.map((unit) => ({
            value: unit.id,
            label: unit.type.name,
        })),
    });

    const mutation = useMutation({
        mutationFn: (data: ReservationSchemaType) =>
            crudService.post<ReservationSchemaType, any>("/reservation/", data),
        onSuccess() {
            toast.success("Reservation créé avec succès");
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            form.reset({
                name: "",
                unit: "",
                contact: "",
                start: undefined,
                end: undefined,
                price: "",
            });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const form = useForm<ReservationSchemaType>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            name: "",
            unit: "",
            contact: "",
            start: undefined,
            end: undefined,
            price: "",
        }
    });

    async function submit(formData: ReservationSchemaType) {
        const { success, data } = reservationSchema.safeParse(formData);
        if (success) {
            mutation.mutate(data)
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations de la reservation</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du prospect</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom du prospect"
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
                            name="unit"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Unité</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.unit}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingUnits ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : units && units.length > 0 ? (
                                                    units.map((unit) => (
                                                        <SelectItem key={unit.value} value={unit.value}>
                                                            {unit.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        Aucune unité disponible
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
                            name="contact"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Contact</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le numero du contact"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.contact}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="start"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date du début</FormLabel>
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
                                    <FormLabel className="text-neutral-600">Date de fin</FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.end} hasIcon={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
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
