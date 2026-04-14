import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect } from "react"
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import InputFile from "@/components/ui/input-file";
import { tenantSchema, type TenantSchemaType } from "@/lib/zod/tenants";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Tenant, TenantClient } from "@/types/tenant";
import { apiFetch, crudService } from "@/lib/api";
import { urlToFile } from "@/lib/upload";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { paymentMode } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import RequiredLabel from "@/components/ui/required-label";


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
        defaultValues: {
            firstname: "",
            lastname: "",
            company: "",
            phone: "",
            email: "",
            address: "",
            paymentMode: "CASH",
            maritalStatus: "",
            income: "",
            bankInfo: "",
            documents: [],
        }
    });

    useEffect(() => {
        if (tenant) {
            form.reset({
                firstname: tenant.firstname,
                lastname: tenant.lastname,
                company: tenant.company,
                phone: tenant.phone,
                email: tenant.email,
                address: tenant.address,
                paymentMode: tenant.paymentMode as "CASH" | "BANK" | "CHECK",
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
            form.append("firstname", data.firstname);
            form.append("lastname", data.lastname);
            form.append("company", data.company);
            form.append("phone", data.phone);
            form.append("email", data.email);
            form.append("address", data.address);
            form.append("maritalStatus", data.maritalStatus || "");
            form.append("income", data.income);
            form.append("paymentMode", data.paymentMode);
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
            <h2 className="font-medium">Informations du propriétaire</h2>
            <Activity mode={isLoadingTenant ? 'visible' : "hidden"}>
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
                        <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Entreprise<RequiredLabel /> </FormLabel>
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
                                    <FormLabel className="text-neutral-600">Revenu<RequiredLabel /> </FormLabel>
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
                                    <FormLabel className="text-neutral-600">Situation familliale<RequiredLabel /> </FormLabel>
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
        </div>
    )
}
