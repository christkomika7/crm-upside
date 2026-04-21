import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Unit } from "@/types/unit";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { useEffect, useState } from "react";
import { propertyManagementSchema, type PropertyManagementSchemaType } from "@/lib/zod/property-management";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import MultipleSelector from "@/components/ui/mullti-select";
import type { PersonalService } from "@/types/personal-service";
import Modal from "@/components/modal/modal";
import PersonalServiceModal from "@/components/modal/personal-service";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { PropertyManagement } from "@/types/property-management";
import type { LabelType } from "@/types/utils";
import { DEFAULT_VALUES } from "./lib/utils";
import Visibility from "@/components/ui/visibility";
import FormSkeleton from "@/components/skeleton/form-skeleton";
import { SelectField } from "@/components/ui/select-field";
import RequiredLabel from "@/components/ui/required-label";

type EditPropertyManagementProps = {
    id: string;
}

export default function EditPropertyManagement({ id }: EditPropertyManagementProps) {
    const form = useForm<PropertyManagementSchemaType>({
        resolver: zodResolver(propertyManagementSchema),
        defaultValues: DEFAULT_VALUES
    });

    const [open, setOpen] = useState<boolean>(false);

    const building = form.watch("building");

    const { isPending: isGettingPropertyManagement, data: propertyManagement } = useQuery({
        queryKey: ["property-management", id],
        enabled: !!id,
        queryFn: () => apiFetch<PropertyManagement>(`/property-management/${id}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always" as const,
        refetchOnWindowFocus: true,
    });


    const { isPending, data: personalServiceOptions } = useQuery({
        queryKey: ["personal-services"],
        queryFn: () => apiFetch<PersonalService[]>("/personal-service/"),
        select: (data) => data.map((personalService) => ({
            value: personalService.id,
            label: personalService.name,
        })),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always" as const,
        refetchOnWindowFocus: true,
    });

    const { isPending: isGettingBuildings, data: buildings } = useQuery({
        queryKey: ["buildings"],
        queryFn: () => apiFetch<LabelType[]>("/building/list"),
        select: (data) => data.map((building) => ({
            value: building.value,
            label: building.label,
        })),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always" as const,
        refetchOnWindowFocus: true,
    });

    const { isPending: isGettingUnits, data: units = [] } = useQuery({
        queryKey: ["units", building],
        queryFn: () => apiFetch<Unit[]>(`/unit/building?id=${building}`),
        enabled: !!building,
        select: (data) =>
            data.map((unit) => ({
                value: unit.id,
                label: unit.reference,
            })),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always" as const,
        refetchOnWindowFocus: true,
    });

    const mutation = useMutation({
        mutationFn: ({ propertyManagementId, data }: { data: PropertyManagementSchemaType, propertyManagementId: string }) =>
            crudService.put<PropertyManagementSchemaType, any>(`/property-management/${propertyManagementId}`, data),
        onSuccess() {
            toast.success("Gestion de propriété modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["property-managements"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (propertyManagement) {
            form.reset({
                administrativeManagement: propertyManagement.administrativeManagement,
                technicalManagement: propertyManagement.technicalManagement,
                services: propertyManagement.services.map((service) => service.id),
                start: new Date(propertyManagement.start),
                end: new Date(propertyManagement.end),
                active: propertyManagement.active,
                observation: propertyManagement.observations,
                building: "",
                units: [],
            });
        }
    }, [propertyManagement]);

    useEffect(() => {
        if (!buildings || !propertyManagement) return
        form.setValue("building", propertyManagement.buildingId)
    }, [buildings, propertyManagement]);

    useEffect(() => {
        if (!units || !propertyManagement) return
        form.setValue("units", propertyManagement.units)
    }, [units, propertyManagement]);


    async function submit(formData: PropertyManagementSchemaType) {
        const { success, data } = propertyManagementSchema.safeParse(formData);
        if (success && propertyManagement?.id) {
            mutation.mutate({ propertyManagementId: propertyManagement.id, data })
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <Visibility isLoading={isGettingPropertyManagement} fallback={<FormSkeleton />}>
                <h2 className="font-medium">Informations de la reservation</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submit)}
                        className="space-y-4.5 w-full"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="building"
                                render={({ field, formState }) => (
                                    <SelectField
                                        label="Bâtiment"
                                        required
                                        placeholder="Sélectionner un bâtiment"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={buildings}
                                        isLoading={isGettingBuildings}
                                        hasError={!!formState.errors.building}
                                        emptyMessage=" Aucun bâtiment disponible"
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="units"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-600">Unité<RequiredLabel /></FormLabel>
                                        <FormControl>
                                            <MultipleSelector
                                                commandProps={{
                                                    label: 'Unité'
                                                }}
                                                value={
                                                    field.value?.map((item: string) => ({
                                                        value: item,
                                                        label: item,
                                                    })) ?? []
                                                }
                                                disabled={!building}
                                                isGettingData={isGettingUnits}
                                                onChange={(options) => {
                                                    field.onChange(options.map((opt) => opt.value))
                                                }}
                                                defaultOptions={units ?? []}
                                                placeholder='Selectionnez des unités'
                                                hideClearAllButton={false}
                                                hidePlaceholderWhenSelected
                                                emptyIndicator={<p className='text-center text-sm'>Aucune unité disponible</p>}
                                                className='w-full'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col">
                                <Label className="text-neutral-600 mb-0.5 relative -top-0.5 text-sm font-medium p-0">Type de gestion confiée</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="administrativeManagement"
                                        render={({ field }) => (
                                            <FormItem className={cn("flex flex-row gap-x-2 justify-between items-center px-3 h-10 border-border border rounded-md", {
                                                "bg-emerald-50 border-emerald-background ring-emerald-background/50 ring-[3px]": field.value,
                                                "border-destructive ring-[3px] ring-destructive/20": form.formState.errors.administrativeManagement
                                            })}>
                                                <FormLabel className="text-neutral-600! w-full h-full ">G. administrative</FormLabel>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-border!" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="technicalManagement"
                                        render={({ field }) => (
                                            <FormItem className={cn("flex flex-row gap-x-2 justify-between items-center px-3 h-10 border-border border rounded-md", {
                                                "bg-emerald-50 border-emerald-background ring-emerald-background/50 ring-[3px]": field.value,
                                                "border-destructive ring-[3px] ring-destructive/20": form.formState.errors.administrativeManagement

                                            })}>
                                                <FormLabel className="text-neutral-600">G. technique</FormLabel>
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {form.formState.errors.administrativeManagement && (
                                    <p className="text-sm text-destructive mt-1">
                                        {form.formState.errors.administrativeManagement.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <FormField
                                control={form.control}
                                name="services"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-neutral-600">Prestations / équipements pris en charge</FormLabel>
                                        <FormControl>
                                            <MultipleSelector
                                                commandProps={{
                                                    label: 'Selection des prestations / équipements pris en charge'
                                                }}
                                                value={
                                                    field.value?.map((item: string) => ({
                                                        value: item,
                                                        label: item,
                                                    })) ?? []
                                                }
                                                isGettingData={isPending}
                                                onChange={(options) => {
                                                    field.onChange(options.map((opt) => opt.value))
                                                }}
                                                defaultOptions={personalServiceOptions ?? []}
                                                placeholder='Selectionnez des services personnels'
                                                hideClearAllButton={false}
                                                hidePlaceholderWhenSelected
                                                emptyIndicator={<p className='text-center text-sm'>Aucun service personnel sélectionné</p>}
                                                className='w-full'
                                                hasAction={true}
                                                setModal={setOpen}
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
                                        <FormLabel className="text-neutral-600">Début du mandat<RequiredLabel /></FormLabel>
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
                                        <FormLabel className="text-neutral-600">Fin du mandat<RequiredLabel /></FormLabel>
                                        <FormControl>
                                            <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.end} hasIcon={true} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col">
                                <Label className="text-neutral-600 mb-0.5 relative -top-0.5 text-sm font-medium p-0">Mandat</Label>
                                <FormField
                                    control={form.control}
                                    name="active"
                                    render={({ field }) => (
                                        <FormItem className={cn("flex flex-row gap-x-2 justify-between items-center px-3 h-10 border-border border rounded-md", {
                                            "bg-emerald-50 border-emerald-background ring-emerald-background/50 ring-[3px]": field.value
                                        })} >
                                            <FormLabel className="text-neutral-600 w-full h-full">Etat du mandat</FormLabel>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="observation"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600"> Observations / remarques</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            value={field.value}
                                            onChange={field.onChange}
                                            aria-invalid={!!form.formState.errors.observation}
                                            placeholder='Note'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
            </Visibility>
            <Modal open={open} setOpen={setOpen} title='Gestion des prestations / équipements'>
                <PersonalServiceModal />
            </Modal>
        </div >
    )
}
