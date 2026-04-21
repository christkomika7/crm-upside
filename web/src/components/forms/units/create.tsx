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
import { LayersPlusIcon } from "lucide-react";
import Modal from "@/components/modal/modal";
import TypeModal from "@/components/modal/type";
import RequiredLabel from "@/components/ui/required-label";
import { DEFAULT_VALUES } from "./lib/utils";
import type { LabelType } from "@/types/utils";
import { SelectField } from "@/components/ui/select-field";

export default function CreateUnit() {
    const [open, setOpen] = useState(false);

    const form = useForm<UnitSchemaType>({
        resolver: zodResolver(unitSchema),
        defaultValues: DEFAULT_VALUES
    });


    const { isPending: isLoadingTypes, data: types } = useQuery({
        queryKey: ["types"],
        queryFn: () => apiFetch<Type[]>("/type/"),
        select: (data) => data.map((type) => ({
            value: type.id,
            label: type.name,
        })),
    });

    const { isPending: isLoadingBuildings, data: buildings } = useQuery({
        queryKey: ["buildings"],
        queryFn: () => apiFetch<LabelType[]>("/building/list"),
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            crudService.post<FormData, any>("/unit/", data),
        onSuccess() {
            toast.success("Unité créée avec succès");
            queryClient.invalidateQueries({ queryKey: ["units"] });
            form.reset(DEFAULT_VALUES);
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
            form.append("reference", data.reference);
            form.append("building", data.building);
            form.append("rentalStatus", data.rentalStatus);
            form.append("surface", data.surface.toString());
            form.append("livingroom", data.livingroom.toString());
            form.append("rent", data.rent.toString());
            form.append("dining", data.dining.toString());
            form.append("kitchen", data.kitchen.toString());
            form.append("bedroom", data.bedroom.toString());
            form.append("bathroom", data.bathroom.toString());
            form.append("furnished", data.furnished);
            form.append("wifi", data.wifi.toString());
            form.append("water", data.water.toString());
            form.append("electricity", data.electricity.toString());
            form.append("tv", data.tv.toString());
            form.append("charges", data.charges);
            form.append("extraCharges", data.extraCharges)

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
                            name="reference"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Référence<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Référence de l'unité" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field, formState }) => (
                                <div className="grid grid-cols-[1fr_40px] items-end gap-x-2">
                                    <SelectField
                                        label="Type"
                                        required
                                        placeholder="Sélectionner un type"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        options={types}
                                        isLoading={isLoadingTypes}
                                        hasError={!!formState.errors.type}
                                        emptyMessage="Aucun type disponible"
                                    />
                                    <Button onClick={() => setOpen(true)} type='button' variant="outline" className="h-10 shadow-none">
                                        <LayersPlusIcon />
                                    </Button>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="building"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Bâtiment"
                                    required
                                    placeholder="Sélectionner un bâtiment"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    options={buildings}
                                    isLoading={isLoadingBuildings}
                                    hasError={!!formState.errors.building}
                                    emptyMessage="Aucun bâtiment disponible"
                                />
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
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="FREE">Libre</SelectItem>
                                                <SelectItem value="OCCUPED">Occupé</SelectItem>
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
                            name="livingroom"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nombre de salon<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de salon"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.livingroom}
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
                            name="wifi"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Wifi<RequiredLabel /></FormLabel>
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
                                    <FormLabel className="text-neutral-600">Eau<RequiredLabel /></FormLabel>
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
                                    <FormLabel className="text-neutral-600">Electricité<RequiredLabel /></FormLabel>
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
                                    <FormLabel className="text-neutral-600">TV<RequiredLabel /></FormLabel>
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
                        <FormField
                            control={form.control}
                            name="extraCharges"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix des charges ponctuelles<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            suffix="FCFA"
                                            placeholder="Entrer le prix des charges ponctuelles"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.extraCharges}
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
