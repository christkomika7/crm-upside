import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"
import { useForm } from "react-hook-form";
import { tenantSchema, type TenantSchemaType } from "@/lib/zod/tenants";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Tenant, TenantClient } from "@/types/tenant";
import { apiFetch, crudService } from "@/lib/api";
import { urlToFile } from "@/lib/upload";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { paymentMode } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";

import InputFile from "@/components/ui/input-file";
import RequiredLabel from "@/components/ui/required-label";
import Visibility from "@/components/ui/visibility";
import FormSkeleton from "@/components/skeleton/form-skeleton";
import MultipleSelector from "@/components/ui/mullti-select";
import { DEFAULT_VALUES } from "./lib/utils";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


type EditTenantProps = {
    id: string;
}

export default function EditTenant({ id }: EditTenantProps) {
    const { isPending: isLoadingTenant, data: tenant } = useQuery<TenantClient>({
        queryKey: ["tenant", id],
        queryFn: async () => {
            const data = await apiFetch<Tenant>(`/tenant/${id}`);
            return {
                ...data,
                documents: data.documents?.length
                    ? await Promise.all(data.documents.map((url) => urlToFile(url)))
                    : [],
            };
        },
    });

    const mutation = useMutation({
        mutationFn: ({ tenantId, data }: { data: FormData, tenantId: string }) =>
            crudService.put<FormData, any>(`/tenant/${tenantId}`, data),
        onSuccess() {
            toast.success("Locataire modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const form = useForm<TenantSchemaType>({
        resolver: zodResolver(tenantSchema),
        defaultValues: DEFAULT_VALUES
    });

    useEffect(() => {
        if (tenant) {
            form.reset({
                isPersonal: tenant.isPersonal,
                isDiplomatic: tenant.isDiplomatic,
                firstname: tenant.firstname,
                lastname: tenant.lastname,
                company: tenant.company,
                phone: tenant.phone,
                email: tenant.email,
                address: tenant.address,
                paymentMode: tenant.paymentMode,
                maritalStatus: tenant.maritalStatus,
                income: tenant.income,
                bankInfo: tenant.bankInfo,
                documents: tenant.documents,
            })
        }
    }, [tenant])

    async function submit(formData: TenantSchemaType) {
        const { success, data } = tenantSchema.safeParse(formData);
        if (success && tenant?.id) {
            const form = new FormData();
            form.append("isPersonal", JSON.stringify(data.isPersonal));
            form.append("isDiplomatic", JSON.stringify(data.isDiplomatic));
            form.append("firstname", data.firstname);
            form.append("lastname", data.lastname);
            data.company && form.append("company", data.company);
            form.append("phone", data.phone);
            form.append("email", data.email);
            form.append("address", data.address);
            form.append("maritalStatus", data.maritalStatus || "");
            data.income && form.append("income", data.income);
            form.append("paymentMode", JSON.stringify(data.paymentMode));
            form.append("bankInfo", data.bankInfo);

            if (data.documents && data.documents.length > 0) {
                data.documents.forEach((file) => {
                    form.append("documents", file);
                });
            }
            mutation.mutate({ tenantId: tenant.id, data: form });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <Visibility isLoading={isLoadingTenant} fallback={<FormSkeleton />}>
                <h2 className="font-medium">Informations du propriétaire</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submit)}
                        className="space-y-4.5 w-full"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <Label className="text-neutral-600 mb-0.5 relative -top-0.5 text-sm font-medium p-0">
                                    Type de locataire
                                </Label>
                                <FormField
                                    control={form.control}
                                    name="isPersonal"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row gap-x-1 p-1 h-10 bg-neutral-50/50 border border-neutral-200 rounded-lg">
                                            <div className="flex items-center  gap-0.5 w-full">
                                                {(
                                                    [
                                                        { value: true, label: "Personne physique" },
                                                        { value: false, label: "Personne morale" },
                                                    ] as const
                                                ).map(({ value, label }) => {
                                                    const isActive = field.value === value;
                                                    return (
                                                        <button
                                                            key={label}
                                                            type="button"
                                                            onClick={() => field.onChange(value)}
                                                            className={cn(
                                                                "flex-1 rounded-md text-sm h-8 font-medium transition-all duration-150",
                                                                isActive
                                                                    ? "bg-white text-emerald-600 border border-emerald-200 shadow-sm"
                                                                    : "text-neutral-400 hover:text-neutral-600"
                                                            )}
                                                        >
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-neutral-600">Prénom<RequiredLabel /> </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Entrer le prénom"
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
                                        <FormLabel className="text-neutral-600">Nom<RequiredLabel /> </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Entrer le nom"
                                                value={field.value}
                                                aria-invalid={!!form.formState.errors.lastname}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col">
                                <Label className="text-neutral-600 mb-0.5 relative -top-0.5 text-sm font-medium p-0">
                                    Statut diplomatique
                                </Label>
                                <FormField
                                    control={form.control}
                                    name="isDiplomatic"
                                    render={({ field }) => (
                                        <FormItem
                                            className={cn(
                                                "flex flex-row gap-x-2 justify-between items-center px-3 h-10 border border-border rounded-md transition-all duration-150",
                                                field.value
                                                    ? "border-emerald-background ring-emerald-background/50 ring-[3px]"
                                                    : "bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FormLabel className={cn(
                                                    "text-sm font-medium transition-colors duration-150 cursor-pointer",
                                                    field.value ? "text-emerald-700" : "text-neutral-600"
                                                )}>
                                                    {field.value ? "Cas diplomatique" : "Non diplomatique"}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-neutral-600">Entreprise</FormLabel>
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
                                        <FormLabel className="text-neutral-600">Numéro de téléphone<RequiredLabel /> </FormLabel>
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
                                        <FormLabel className="text-neutral-600">Adresse email<RequiredLabel /> </FormLabel>
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
                                        <FormLabel className="text-neutral-600">Adresse<RequiredLabel /> </FormLabel>
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
                                name="income"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-neutral-600">Revenu</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Entrer le revenu"
                                                type="number"
                                                value={field.value}
                                                aria-invalid={!!form.formState.errors.income}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maritalStatus"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-neutral-600">Situation familliale</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Veuillez saisir la situation familliale"
                                                value={field.value}
                                                aria-invalid={!!form.formState.errors.maritalStatus}
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
                                        <FormLabel className="text-neutral-600">Mode de paiement<RequiredLabel /> </FormLabel>
                                        <FormControl>
                                            <MultipleSelector
                                                commandProps={{
                                                    label: 'Selection des modes de paiement'
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
                                                defaultOptions={paymentMode}
                                                placeholder='Selectionnez des modes de paiement'
                                                hideClearAllButton
                                                hidePlaceholderWhenSelected
                                                emptyIndicator={<p className='text-center text-sm'>Aucun mode de paiement sélectionné</p>}
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
                                    <FormLabel className="text-neutral-600">Informations bancaires<RequiredLabel /> </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Veuillez saisir les informations bancaires"
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
                                        <InputFile title="Documents" value={field.value} onChange={field.onChange} error={form.formState.errors.documents?.message} />
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

        </div>
    )
}
