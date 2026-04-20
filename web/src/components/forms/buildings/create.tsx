import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import InputFile from "@/components/ui/input-file";
import { buildingSchema, type BuildingSchemaType } from "@/lib/zod/building";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpIcon, ImageIcon } from "lucide-react";
import InputMap from "@/components/input/input-map";
import MultipleSelector from "@/components/ui/mullti-select";
import { buildingManagementStatus } from "@/lib/data";
import Modal from "@/components/modal/modal";
import { apiFetch, crudService } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import LotTypeModal from "@/components/modal/lot-type";
import type { LotType } from "@/types/lot-type";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import RequiredLabel from "@/components/ui/required-label";
import { DEFAULT_VALUES } from "./lib/utils";

export default function CreateBuilding() {
    const [open, setOpen] = useState(false);

    const form = useForm<BuildingSchemaType>({
        resolver: zodResolver(buildingSchema),
        defaultValues: DEFAULT_VALUES
    });

    const { isPending, data: lotTypeOptions } = useQuery({
        queryKey: ["lot-types"],
        queryFn: () => apiFetch<LotType[]>("/lot-type/"),
        select: (data) => data.map((lotType) => ({
            value: lotType.id,
            label: lotType.name,
        })),
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            crudService.post<FormData, any>("/building/", data),
        onSuccess() {
            toast.success("Bâtiment créé avec succès");
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
            form.reset(DEFAULT_VALUES);
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    async function submit(formData: BuildingSchemaType) {
        const { success, data } = buildingSchema.safeParse({
            ...formData,
            constructionDate: new Date(formData.constructionDate),
        });
        if (success) {
            const form = new FormData();

            form.append("name", data.name);
            form.append("reference", data.reference);
            form.append("location", data.location);
            form.append("constructionDate", data.constructionDate.toISOString());
            form.append("lotType", JSON.stringify(data.lotType));
            form.append("security", data.security.toString());
            form.append("camera", data.camera.toString());
            form.append("elevator", data.elevator.toString());
            form.append("parking", data.parking.toString());
            form.append("pool", data.pool.toString());
            form.append("generator", data.generator.toString());
            form.append("waterBorehole", data.waterBorehole.toString());
            form.append("gym", data.gym.toString());
            form.append("garden", data.garden.toString());
            form.append("status", JSON.stringify(data.status));
            form.append("map", data.map || "");

            if (data.photos && data.photos.length > 0) {
                data.photos.forEach((file) => {
                    form.append("photos", file);
                });
            }

            if (data.deeds && data.deeds.length > 0) {
                data.deeds.forEach((file) => {
                    form.append("deeds", file);
                });
            }

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
            <h2 className="font-medium">Informations du bâtiment</h2>
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
                                        <Input
                                            placeholder="Entrer la référence"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.reference}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom complet"
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
                            name="location"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Localisation<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer la localisation"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.location}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="constructionDate"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date de construction<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.lotType} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lotType"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Type de lot<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            commandProps={{
                                                label: 'Selection des types de lot'
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
                                            defaultOptions={lotTypeOptions ?? []}
                                            placeholder='Selectionnez des types de lot'
                                            hideClearAllButton={false}
                                            hidePlaceholderWhenSelected
                                            emptyIndicator={<p className='text-center text-sm'>Aucun type de lot sélectionné</p>}
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
                            name="security"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Sécurité</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.security}>
                                                <SelectValue placeholder="La sécurité est il present ?" />
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
                            name="camera"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Caméra</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.camera}>
                                                <SelectValue placeholder="La caméra est il present ?" />
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
                            name="elevator"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Ascenseur</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.elevator}>
                                                <SelectValue placeholder="L'ascenseur est il present ?" />
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
                            name="parking"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Parking</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.parking}>
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
                            name="pool"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Piscine</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.pool}>
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
                            name="generator"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Groupe élèctrogène</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.generator}>
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
                            name="waterBorehole"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Bâche à eau</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.waterBorehole}>
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
                            name="gym"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Salle de sport</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.gym}>
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
                            name="garden"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Jardin</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => field.onChange(e === "yes" ? true : false)} value={field.value ? "yes" : "no"} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.garden}>
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
                            name="status"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Type de gestion<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            commandProps={{
                                                label: 'Selection des statuts'
                                            }}
                                            value={
                                                field.value?.map((item: string) => ({
                                                    value: item,
                                                    label: item,
                                                })) ?? []
                                            }
                                            onChange={(options) => {
                                                field.onChange(options.map((opt) => opt.value))
                                            }}
                                            defaultOptions={buildingManagementStatus}
                                            placeholder='Selectionnez des types de gestions'
                                            hideClearAllButton
                                            hidePlaceholderWhenSelected
                                            emptyIndicator={<p className='text-center text-sm'>Aucun types sélectionné</p>}
                                            className='w-full'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="map"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Google map<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <InputMap value={field.value} onChange={field.onChange} error={!!form.formState.errors.map} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="photos"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile accept="image/png,image/jpeg,image/jpg,image/webp" title="Ajouter des photos du bâtiment" multiple={true} value={field.value} onChange={field.onChange} error={form.formState.errors.photos?.message}
                                            icon={
                                                <div className="flex items-center bg-blue-600/5 justify-center rounded-full  p-2.5">
                                                    <ImageIcon className="size-6 text-blue-600" />
                                                </div>
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deeds"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile multiple={true} title="Ajouter les actes de propriété" value={field.value} onChange={field.onChange} error={form.formState.errors.deeds?.message}
                                            icon={
                                                <div className="flex items-center bg-emerald-600/5 justify-center rounded-full  p-2.5">
                                                    <FileUpIcon className="size-6 text-emerald-600" />
                                                </div>
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="documents"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile multiple={true} title="Autres documents" value={field.value} onChange={field.onChange} error={form.formState.errors.documents?.message}
                                            icon={
                                                <div className="flex items-center bg-amber-600/5 justify-center rounded-full  p-2.5">
                                                    <FileUpIcon className="size-6 text-amber-400" />
                                                </div>
                                            }
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
            <Modal open={open} setOpen={setOpen} title='Gestion des types de lot'>
                <LotTypeModal />
            </Modal>
        </div>
    )
}
