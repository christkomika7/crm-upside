import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { serviceProvidersSchema, type ServiceProvidersSchemaType } from "@/lib/zod/service-providers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputFile from "@/components/ui/input-file";
import { FileUpIcon, ImageIcon, LayersPlusIcon, StarIcon } from "lucide-react";
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group"
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Profession } from "@/types/profession";
import { apiFetch, crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { paymentMode } from "@/lib/data";
import Modal from "@/components/modal/modal";
import ProfessionModal from "@/components/modal/profession";
import RequiredLabel from "@/components/ui/required-label";
import type { ServiceProvider, ServiceProviderForm } from "@/types/service-provider";
import { urlToFile } from "@/lib/upload";

type EditServiceProviderProps = {
    id: string;
}

export default function EditServiceProvider({ id }: EditServiceProviderProps) {
    const [open, setOpen] = useState(false);

    const { isPending: isLoadingServiceProvider, data: serviceProvider } = useQuery<ServiceProviderForm>({
        queryKey: ["service-provider", id],
        queryFn: async () => {
            const data = await apiFetch<ServiceProvider>(`/service-provider/${id}`);
            return {
                ...data,
                rcc: data.rcc
                    ? [await urlToFile(data.rcc)]
                    : [],
                idCard: data.idCard
                    ? [await urlToFile(data.idCard)]
                    : [],
                taxCertificate: data.taxCertificate
                    ? [await urlToFile(data.taxCertificate)]
                    : [],
            };
        },
    });

    const form = useForm<ServiceProvidersSchemaType>({
        resolver: zodResolver(serviceProvidersSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            company: "",
            profession: "",
            address: "",
            phone: "",
            email: "",
            nif: "",
            registerNumber: "",
            paymentMode: "CASH",
            rating: {
                note: 0,
                comment: "",
            },
            rcc: undefined,
            idCard: undefined,
            taxCertificate: undefined,
        }
    });


    const { isPending: isGettingProfession, data: professionOptions } = useQuery({
        queryKey: ["professions"],
        queryFn: () => apiFetch<Profession[]>("/profession/"),
        select: (data) => data.map((profession) => ({
            value: profession.id,
            label: profession.name,
        })),
    });

    const mutation = useMutation({
        mutationFn: ({ serviceProviderId, data }: { data: FormData, serviceProviderId: string }) =>
            crudService.put<FormData, any>(`/service-provider/${serviceProviderId}`, data),
        onSuccess() {
            toast.success("Prestataire modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["service-providers"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (serviceProvider) {
            form.reset({
                firstname: serviceProvider.firstname,
                lastname: serviceProvider.lastname,
                company: serviceProvider.company,
                profession: serviceProvider.professionId,
                address: serviceProvider.address,
                phone: serviceProvider.phone,
                email: serviceProvider.email,
                nif: serviceProvider.nif,
                registerNumber: serviceProvider.registerNumber,
                paymentMode: serviceProvider.paymentMode,
                rating: {
                    note: serviceProvider.note,
                    comment: serviceProvider.comment,
                },
                rcc: serviceProvider.rcc,
                idCard: serviceProvider.idCard,
                taxCertificate: serviceProvider.taxCertificate,
            });
        }
    }, [serviceProvider])

    async function submit(formData: ServiceProvidersSchemaType) {
        const { success, data } = serviceProvidersSchema.safeParse(formData);
        if (success && serviceProvider?.id) {
            const form = new FormData();

            form.append("firstname", data.firstname);
            form.append("lastname", data.lastname);
            form.append("company", data.company);
            form.append("profession", data.profession);
            form.append("address", data.address);
            form.append("phone", data.phone);
            form.append("email", data.email);
            form.append("nif", data.nif);
            form.append("registerNumber", data.registerNumber);
            form.append("paymentMode", data.paymentMode);
            form.append("rating", JSON.stringify(data.rating));

            if (data.rcc) {
                data.rcc.forEach((file) => {
                    form.append("rcc", file);
                });
            }

            if (data.idCard) {
                data.idCard.forEach((file) => {
                    form.append("idCard", file);
                });
            }

            if (data.taxCertificate) {
                data.taxCertificate.forEach((file) => {
                    form.append("taxCertificate", file);
                });
            }

            mutation.mutate({ data: form, serviceProviderId: serviceProvider.id })
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Modifier les informations du prestataire</h2>
            <Activity mode={isLoadingServiceProvider ? 'visible' : "hidden"}>
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
                            name="firstname"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prénom</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le prénom du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.firstname}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom de famille du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.lastname}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Entreprise</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom de l'entreprise"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.company}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Profession</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                                <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.profession}>
                                                    <SelectValue placeholder="Sélectionner une profession" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingProfession ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : professionOptions && professionOptions.length > 0 ? (
                                                        professionOptions.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucune profession disponible
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
                            name="address"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Adresse</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'adresse du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.address}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Téléphone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le téléphone du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.phone}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'email du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.email}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='nif'
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Numéro d'identification fiscale (NIF)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le numéro d'identification fiscale"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.nif}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="registerNumber"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Numéro d'enregistrement</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le numéro d'enregistrement"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.registerNumber}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentMode"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Mode de paiement<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.paymentMode}>
                                                <SelectValue placeholder="Selectionner une valeur" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {paymentMode.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
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
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-600">Note de qualité</FormLabel>
                                    <FormControl>
                                        <ButtonGroup className="w-full">
                                            <div className="flex items-center px-3 gap-1 border-input border rounded-md border-r-0">
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const note = field.value?.note || 0;
                                                    const fillRatio = Math.min(1, Math.max(0, note - (star - 1)));

                                                    return (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onMouseMove={(e) => {
                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                const ratio = (e.clientX - rect.left) / rect.width;
                                                                const preciseNote = Math.round((star - 1 + ratio) * 10) / 10;
                                                                field.onChange({ ...field.value, note: Math.min(5, Math.max(0, preciseNote)) });
                                                            }}
                                                            onClick={(e) => {
                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                const ratio = (e.clientX - rect.left) / rect.width;
                                                                const preciseNote = Math.round((star - 1 + ratio) * 10) / 10;
                                                                field.onChange({ ...field.value, note: Math.min(5, Math.max(0, preciseNote)) });
                                                            }}
                                                            className="relative cursor-pointer transition-colors"
                                                        >
                                                            <StarIcon size={20} className="size-4 text-gray-300" />
                                                            <span
                                                                className="absolute inset-0 overflow-hidden"
                                                                style={{ width: `${fillRatio * 100}%` }}
                                                            >
                                                                <StarIcon size={20} className="size-4 fill-amber-500 text-amber-500" />
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <ButtonGroupSeparator />
                                            <p className="text-neutral-600 border-y w-8 flex justify-center items-center text-sm border-border">{field.value?.note}</p>
                                            <ButtonGroupSeparator />
                                            <Input
                                                className="w-full"
                                                placeholder="Entrer un commentaire"
                                                value={field.value?.comment || ""}
                                                aria-invalid={!!form.formState.errors.rating?.comment}
                                                onChange={(e) => field.onChange({ ...field.value, comment: e.target.value })}
                                            />
                                        </ButtonGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="rcc"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile title="Registre du Commerce et du Crédit Mobilier" multiple={false} value={field.value} onChange={field.onChange} error={form.formState.errors.rcc?.message}
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
                            name="idCard"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile title="Carte d'identité" multiple={false} value={field.value} onChange={field.onChange} error={form.formState.errors.idCard?.message}
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
                            name="taxCertificate"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile title="Attestation fiscale" multiple={false} value={field.value} onChange={field.onChange} error={form.formState.errors.taxCertificate?.message}
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
                                "Modifier"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
            <Modal open={open} setOpen={setOpen} title='Gestion des professions'>
                <ProfessionModal />
            </Modal>
        </div>
    )
}
