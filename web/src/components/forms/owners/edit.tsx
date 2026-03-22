import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ownerSchema, type OwnerSchemaType } from "@/lib/zod/owners";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect } from "react"
import { useForm } from "react-hook-form";
import InputFile from "@/components/ui/input-file";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Building } from "@/types/building";
import type { Owner, OwnerClient } from "@/types/owner";
import { urlToFile } from "@/lib/upload";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import MultipleSelector from "@/components/ui/mullti-select";
import { Textarea } from "@/components/ui/textarea";
import RequiredLabel from "@/components/ui/required-label";


type EditOwnersProps = {
    id: string;
}

export default function EditOwners({ id }: EditOwnersProps) {

    const { isPending, data: buildings } = useQuery({
        queryKey: ["owner-buildings", id],
        enabled: !!id,
        queryFn: () =>
            apiFetch<Building[]>(`/building/available-for-owner/${id}`),
        select: (data) =>
            data.map((building) => ({
                value: building.id,
                label: building.name,
            })),
        staleTime: 0,

    });

    const { isPending: isLoadingOwner, data: owner } = useQuery<OwnerClient>({
        queryKey: ["owner", id],
        queryFn: async () => {
            const data = await apiFetch<Owner>(`/owner/${id}`);
            return {
                ...data,
                documents: data.documents?.length
                    ? await Promise.all(data.documents.map((url) => urlToFile(url)))
                    : [],
            };
        },
    });

    const mutation = useMutation({
        mutationFn: ({ ownerId, data }: { data: FormData, ownerId: string }) =>
            crudService.put<FormData, any>(`/owner/${ownerId}`, data),
        onSuccess() {
            toast.success("Propriétaire modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["owners"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const form = useForm<OwnerSchemaType>({
        resolver: zodResolver(ownerSchema),
        defaultValues: {
            reference: "",
            firstname: "",
            lastname: "",
            company: "",
            phone: "",
            email: "",
            address: "",
            actionnary: "",
            buildings: [],
            bankInfo: "",
            documents: [],
        }
    });

    useEffect(() => {
        if (owner) {
            console.log({ owner })
            form.reset({
                reference: owner.reference,
                firstname: owner.firstname,
                lastname: owner.lastname,
                company: owner.company,
                phone: owner.phone,
                email: owner.email,
                address: owner.address,
                actionnary: owner.actionnary,
                buildings: owner.buildings,
                bankInfo: owner.bankInfo,
                documents: owner.documents,
            })
        }


    }, [owner])

    async function submit(formData: OwnerSchemaType) {
        const { success, data } = ownerSchema.safeParse(formData);
        if (success && owner?.id) {
            const form = new FormData();

            form.append("buildings", JSON.stringify(data.buildings));
            form.append("reference", data.reference);
            form.append("firstname", data.firstname);
            form.append("lastname", data.lastname);
            form.append("company", data.company);
            form.append("phone", data.phone);
            form.append("email", data.email);
            form.append("address", data.address);
            form.append("actionnary", data.actionnary);
            form.append("bankInfo", data.bankInfo);

            if (data.documents && data.documents.length > 0) {
                data.documents.forEach((file) => {
                    form.append("documents", file);
                });
            }
            mutation.mutate({ data: form, ownerId: owner.id })
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations du propriétaire</h2>
            <Activity mode={isLoadingOwner ? 'visible' : "hidden"}>
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
                            name="reference"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Référence<RequiredLabel /> </FormLabel>
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
                            name="firstname"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prénom<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le  prénom"
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
                                    <FormLabel className="text-neutral-600">Nom<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le  nom"
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
                                    <FormLabel className="text-neutral-600">Entreprise<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom de l'enterprise"
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Numéro de téléphone<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le numéro de téléphone"
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
                                    <FormLabel className="text-neutral-600">Adresse email<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'adresse email"
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
                            name="address"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Adresse<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'adresse"
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
                            name="actionnary"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Actionnaire<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'actionnaire (séparer par des points-virgules)"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.actionnary}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="buildings"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Propriétés associées<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            commandProps={{
                                                label: 'Selection des propriétés'
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
                                            defaultOptions={buildings ?? []}
                                            placeholder='Selectionnez des propriétés'
                                            hideClearAllButton={false}
                                            hidePlaceholderWhenSelected
                                            emptyIndicator={<p className='text-center text-sm'>Aucune propriété sélectionnée</p>}
                                            className='w-full'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="bankInfo"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Informations bancaires<RequiredLabel /></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Entrez les informations bancaires"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.bankInfo}
                                        onChange={field.onChange}
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
                                    <InputFile multiple={true} title="Uploader des documents" value={field.value} onChange={field.onChange} error={form.formState.errors.documents?.message} />
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
        </div>
    )
}
