import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import InputFile from "@/components/ui/input-file";
import { unitSchema, type UnitSchemaType } from "@/lib/zod/units";
import { apiFetch, crudService } from "@/lib/api";
import type { Type } from "@/types/type";
import type { Building } from "@/types/building";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LayersPlusIcon } from "lucide-react";
import { furnishedOptions } from "@/lib/data";
import TypeModal from "@/components/modal/type";
import Modal from "@/components/modal/modal";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import type { UnitClient, Unit } from "@/types/unit";
import { urlToFile } from "@/lib/upload";
import RequiredLabel from "@/components/ui/required-label";


type EditUnitProps = {
    id: string;
}


export default function EditUnit({ id }: EditUnitProps) {
    const [formKey, setFormKey] = useState(0);
    const [open, setOpen] = useState(false);

    const form = useForm<UnitSchemaType>({
        resolver: zodResolver(unitSchema),
        defaultValues: {
            reference: "",
            type: "",
            building: "",
            rentalStatus: "",
            surface: 0,
            rooms: 0,
            dining: 0,
            kitchen: 0,
            bedroom: 0,
            bathroom: 0,
            rent: 0,
            furnished: "",
            wifi: false,
            water: false,
            electricity: false,
            tv: false,
            charges: "",
            documents: [],
        }
    });
    const { isPending: isGettingType, data: typeOptions } = useQuery({
        queryKey: ["types"],
        queryFn: () => apiFetch<Type[]>("/type/"),
        select: (data) => data.map((type) => ({
            value: type.id,
            label: type.name,
        })),
        placeholderData: (prev) => prev,
    });

    const { isPending: isGettingBuilding, data: buildingOptions } = useQuery({
        queryKey: ["buildings"],
        queryFn: () => apiFetch<Building[]>("/building/"),
        placeholderData: (prev) => prev,
    });

    const { isPending: isLoadingUnit, data: unit } = useQuery<UnitClient>({
        queryKey: ["unit", id],
        enabled: !!id,
        queryFn: async () => {
            const data = await apiFetch<Unit>(`/unit/${id}`);
            return {
                ...data,
                documents: data.documents?.length
                    ? await Promise.all(data.documents.map((url) => urlToFile(url)))
                    : [],
            };
        },
        refetchOnMount: true,
        staleTime: 0,
    });

    const mutation = useMutation({
        mutationFn: ({ unitId, data }: { data: FormData, unitId: string }) =>
            crudService.put<FormData, any>(`/unit/${unitId}`, data),
        onSuccess() {
            toast.success("Unité modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["units"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (unit && typeOptions && buildingOptions) {
            form.reset({
                type: unit.typeId,
                building: unit.buildingId,
                reference: unit.reference,
                rentalStatus: unit.rentalStatus,
                surface: unit.surface,
                rooms: unit.rooms,
                dining: unit.dining,
                kitchen: unit.kitchen,
                bedroom: unit.bedroom,
                bathroom: unit.bathroom,
                rent: unit.rent,
                furnished: unit.furnished,
                wifi: unit.wifi,
                water: unit.water,
                electricity: unit.electricity,
                tv: unit.tv,
                charges: unit.charges,
                documents: unit.documents,
            });
            setFormKey(prev => prev + 1);
        }
    }, [unit, typeOptions, buildingOptions]);

    async function submit(formData: UnitSchemaType) {
        const { success, data } = unitSchema.safeParse({
            ...formData,
        });
        if (success && unit?.id) {
            const form = new FormData();

            form.append("type", data.type);
            form.append("reference", data.reference);
            form.append("building", data.building);
            form.append("rentalStatus", data.rentalStatus);
            form.append("surface", data.surface.toString());
            form.append("rooms", data.rooms.toString());
            form.append("dining", data.dining.toString());
            form.append("kitchen", data.kitchen.toString());
            form.append("bedroom", data.bedroom.toString());
            form.append("bathroom", data.bathroom.toString());
            form.append("rent", data.rent.toString());
            form.append("furnished", data.furnished);
            form.append("wifi", data.wifi.toString());
            form.append("water", data.water.toString());
            form.append("electricity", data.electricity.toString());
            form.append("tv", data.tv.toString());
            form.append("charges", data.charges);

            if (data.documents && data.documents.length > 0) {
                data.documents.forEach((file) => {
                    form.append("documents", file);
                });
            }
            mutation.mutate({ data: form, unitId: unit.id })
        }
    }
    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Modifier unité</h2>
            <Activity mode={isLoadingUnit ? 'visible' : "hidden"}>
                <Spinner />
            </Activity>
            <Form {...form}>
                <form
                    key={formKey}
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Référence<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Type<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                                <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.type}>
                                                    <SelectValue placeholder="" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingType ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : typeOptions && typeOptions.length > 0 ? (
                                                        typeOptions.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucun type disponible
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => setOpen(true)} type='button' variant="outline" className="h-10 shadow-none">
                                                <LayersPlusIcon />
                                            </Button>
                                        </div>
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
                                    <FormLabel className="text-neutral-600">Bâtiment<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.building}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingBuilding ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : buildingOptions && buildingOptions.length > 0 ? (
                                                    buildingOptions.map((building) => (
                                                        <SelectItem key={building.id} value={building.id}>
                                                            {building.reference}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                                        Aucun bâtiment disponible
                                                    </div>
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
                            name="rentalStatus"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Statut de location<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.rentalStatus}>
                                                <SelectValue placeholder="Selectionner un statut" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="yes">Oui</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="surface"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Surface<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            suffix="m²"
                                            placeholder="Entrer la valeur de la surface"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.surface}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rooms"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nombre de pièces<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de pièces"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.rooms}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dining"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nombre de salle à manger<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de salle à manger"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.dining}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kitchen"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nombre de cuisine<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de cuisine"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.kitchen}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bedroom"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nombre de chambre<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de chambre"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.bedroom}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bathroom"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nombre de salle de bain<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de salle de bain"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.bathroom}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rent"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix de location<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            suffix="FCFA"
                                            placeholder="Entrer le prix de la location"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.rent}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="furnished"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Meublé<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.furnished}>
                                                <SelectValue placeholder="Sélectionner l'état de l'unité" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {furnishedOptions.map((furnished) => (
                                                    <SelectItem key={furnished.value} value={furnished.value}>
                                                        {furnished.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="wifi"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Wifi</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.wifi}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="yes">Oui</SelectItem>
                                                <SelectItem value="no">Non</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="water"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Eau</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.water}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="yes">Oui</SelectItem>
                                                <SelectItem value="no">Non</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="electricity"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Electricité</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.electricity}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="yes">Oui</SelectItem>
                                                <SelectItem value="no">Non</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tv"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">TV</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.tv}>
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="yes">Oui</SelectItem>
                                                <SelectItem value="no">Non</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            suffix="FCFA"
                                            placeholder="Entrer le prix des charges"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.charges}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="documents"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <InputFile multiple={true} title="Documents" value={field.value} onChange={field.onChange} error={form.formState.errors.documents?.message} />
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
            <Modal open={open} setOpen={setOpen} title='Gestion des types de lot'>
                <TypeModal />
            </Modal>
        </div>
    )
}
