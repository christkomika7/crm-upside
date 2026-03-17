import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import InputFile from "@/components/ui/input-file";
import { unitSchema, type UnitSchemaType } from "@/lib/zod/units";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Type } from "@/types/type";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { useState } from "react";
import { furnishedOptions } from "@/lib/data";
import type { Building } from "@/types/building";
import { LayersPlusIcon } from "lucide-react";
import Modal from "@/components/modal/modal";
import TypeModal from "@/components/modal/type";


export default function CreateUnit() {
    const [open, setOpen] = useState(false);

    const form = useForm<UnitSchemaType>({
        resolver: zodResolver(unitSchema),
        defaultValues: {
            type: "",
            building: "",
            rentalStatus: "",
            surface: "",
            rooms: "",
            rent: "",
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
    });

    const { isPending: isGettingBuilding, data: buildingOptions } = useQuery({
        queryKey: ["buildings"],
        queryFn: () => apiFetch<Building[]>("/building/"),
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            crudService.post<FormData, any>("/unit/", data),
        onSuccess() {
            toast.success("Unité créée avec succès");
            queryClient.invalidateQueries({ queryKey: ["units"] });
            form.reset({
                type: "",
                building: "",
                rentalStatus: "",
                surface: "",
                rooms: "",
                rent: "",
                furnished: "",
                wifi: false,
                water: false,
                electricity: false,
                tv: false,
                charges: "",
                documents: [],
            });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    async function submit(formData: UnitSchemaType) {
        const { success, data } = unitSchema.safeParse({
            ...formData,
        });
        if (success) {
            const form = new FormData();

            form.append("type", data.type);
            form.append("building", data.building);
            form.append("rentalStatus", data.rentalStatus);
            form.append("surface", data.surface);
            form.append("rooms", data.rooms);
            form.append("rent", data.rent);
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
            mutation.mutate(form)
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations unité</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Type</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                                <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.building}>
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
                                    <FormLabel className="text-neutral-600">Bâtiment</FormLabel>
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
                                                            {building.name}
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
                                    <FormLabel className="text-neutral-600">Statut de location</FormLabel>
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
                                    <FormLabel className="text-neutral-600">Surface</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer la valeur de la surface"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.surface}
                                            onChange={field.onChange}
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
                                    <FormLabel className="text-neutral-600">Nombre de chambre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de chambre"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.rooms}
                                            onChange={field.onChange}
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
                                    <FormLabel className="text-neutral-600">Prix de location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le prix de la location"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.rent}
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
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Meublé</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.furnished}>
                                                <SelectValue placeholder="" />
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
                                    <FormLabel className="text-neutral-600">Prix des charges</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
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
                                "Enregistrer"
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
