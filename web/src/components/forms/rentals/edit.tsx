import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form";
import { rentalSchema, type RentalSchemaType } from "@/lib/zod/rentals";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Unit } from "@/types/unit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Building } from "@/types/building";
import type { Tenant } from "@/types/tenant";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import type { Rental } from "@/types/rental";

type EditRentalProps = {
    id: string;
}

export default function EditRental({ id }: EditRentalProps) {
    const firstLoad = useRef(false);

    const [buildingId, setBuildingId] = useState("");
    const [units, setUnits] = useState<Unit[]>([]);

    const { isPending: isGettingBuilding, data: buildings } = useQuery({
        queryKey: ["buildings"],
        queryFn: () => apiFetch<Building[]>("/building/"),
        select: (data) => data.map((building) => ({
            value: building.id,
            label: building.name,
        })),
    });

    const { isPending: isGettingTenant, data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => apiFetch<Tenant[]>("/tenant/"),
        select: (data) => data.map((tenant) => ({
            value: tenant.id,
            label: `${tenant.firstname} ${tenant.lastname}`,
        })),
    });

    const { isPending: isGettingUnit, mutate } = useMutation({
        mutationFn: (buildingId: string) =>
            crudService.get<Unit[]>(`/unit/by?id=${buildingId}`),
        onSuccess(data) {
            setUnits(data.data);
        },
    });

    const { isPending: isGettingRental, data: rental } = useQuery<Rental>({
        queryKey: ["rental", id],
        queryFn: async () => await apiFetch<Rental>(`/rental/${id}`)
    });

    const mutation = useMutation({
        mutationFn: ({ rentalId, data }: { data: RentalSchemaType, rentalId: string }) =>
            crudService.put(`/rental/${rentalId}`, data),
        onSuccess() {
            toast.success("Location modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["rentals"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const form = useForm<RentalSchemaType>({
        resolver: zodResolver(rentalSchema),
        defaultValues: {
            price: "",
            start: undefined,
            end: undefined,
            unit: "",
            building: "",
            tenant: ""
        }
    });

    useEffect(() => {
        if (rental) {
            form.reset({
                price: rental.price,
                start: new Date(rental.start),
                end: new Date(rental.end),
                building: rental.buildingId,
                tenant: rental.tenantId,
                unit: String(rental.unitId)
            });
            mutate(rental.buildingId, {
                onSuccess() {
                    if (!firstLoad.current && rental) {
                        form.setValue("unit", rental.id);
                        firstLoad.current = true;
                    }
                }
            });
        }
    }, [rental])

    const handleUnits = useCallback(() => {
        if (buildingId) {
            mutate(buildingId);
        }
    }, [buildingId])


    useEffect(() => {
        handleUnits()
    }, [handleUnits])

    async function submit(formData: RentalSchemaType) {
        const { success, data } = rentalSchema.safeParse(formData);
        if (success && rental?.id) {
            mutation.mutate({ rentalId: rental.id, data })
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations du loyer</h2>
            <Activity mode={isGettingRental ? 'visible' : "hidden"}>
                <Spinner />
            </Activity>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="tenant"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du locataire</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.tenant}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingTenant ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : tenants && tenants.length > 0 ? (
                                                    tenants.map((tenant) => (
                                                        <SelectItem key={tenant.value} value={tenant.value}>
                                                            {tenant.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        Aucun Locataire disponible
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
                            name="building"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du propriétaire</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={e => {
                                                field.onChange(e);
                                                setBuildingId(e);
                                            }}
                                            value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.building}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingBuilding ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : buildings && buildings.length > 0 ? (
                                                    buildings.map((building) => (
                                                        <SelectItem key={building.value} value={building.value}>
                                                            {building.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        Aucun bâtiment disponible
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
                            name="unit"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Unité {JSON.stringify(field.value)}</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.unit}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingUnit ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : units && units.length > 0 ? (
                                                    units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id}>
                                                            {unit.type.name}
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
                    </div>

                    <div className="flex justify-center">
                        <Button disabled={mutation.isPending} type="submit" variant="action" className="max-w-xl h-11">
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
