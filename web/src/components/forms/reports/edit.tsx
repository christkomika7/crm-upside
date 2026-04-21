import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"
import { useForm } from "react-hook-form";
import InputFile from "@/components/ui/input-file";
import { reportSchema, type ReportSchemaType } from "@/lib/zod/reports";
import { Textarea } from "@/components/ui/textarea";
import type { Unit } from "@/types/unit";
import { apiFetch, crudService } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { DatePicker } from "@/components/ui/date-picker";
import type { Report } from "@/types/report";
import { urlToFile } from "@/lib/upload";
import type { LabelType } from "@/types/utils";
import RequiredLabel from "@/components/ui/required-label";
import { SelectField } from "@/components/ui/select-field";
import { DEFAULT_VALUES } from "./lib/utils";
import Visibility from "@/components/ui/visibility";
import FormSkeleton from "@/components/skeleton/form-skeleton";

interface EditReportProps {
    id: string;
}

export default function EditReport({ id }: EditReportProps) {
    const form = useForm<ReportSchemaType>({
        resolver: zodResolver(reportSchema),
        defaultValues: DEFAULT_VALUES
    });

    const tenant = form.watch("tenant");

    const { isPending: isLoadingReport, data: report } = useQuery({
        queryKey: ["report", id],
        enabled: !!id,
        queryFn: async () => {
            const data = await apiFetch<Report>(`/check-in-out/${id}`);
            return {
                ...data,
                documents: data.documents?.length
                    ? await Promise.all(data.documents.map((url) => urlToFile(url)))
                    : [],
            };
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always" as const,
        refetchOnWindowFocus: true,
    });


    const { isPending: isGettingTenants, data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => apiFetch<LabelType[]>("/tenant/list"),
        select: (data) => data.map((tenant) => ({
            value: tenant.value,
            label: tenant.label,
        })),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always" as const,
        refetchOnWindowFocus: true,
    });

    const { isPending: isGettingUnits, data: units } = useQuery({
        queryKey: ["units", tenant],
        enabled: !!tenant,
        queryFn: () => apiFetch<Unit[]>(`/unit/tenant?id=${tenant}`),
        select: (data) => data.map((unit) => ({
            value: unit.id,
            label: `${unit.reference}`,
        })),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always" as const,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (report) {
            form.reset({
                date: new Date(report.date),
                note: report.note,
                documents: report.documents,
                tenant: "",
                unit: "",
            })
        }
    }, [report])

    useEffect(() => {
        if (!report || !tenants) return
        form.setValue("tenant", report.tenantId)
    }, [report, tenants, , form.setValue])

    useEffect(() => {
        if (!report || !units) return
        form.setValue("unit", report.unitId)
    }, [report, units, , form.setValue])



    const mutation = useMutation({
        mutationFn: ({ id, data }: { data: FormData, id: string }) =>
            crudService.put<FormData, any>(`/check-in-out/${id}`, data),
        onSuccess() {
            toast.success("Propriétaire modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["owners"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    async function submit(formData: ReportSchemaType) {
        const { success, data } = reportSchema.safeParse(formData);
        if (success) {
            const formData = new FormData();
            formData.append("date", data.date.toISOString());
            formData.append("tenant", data.tenant);
            formData.append("unit", data.unit);

            data.note && formData.append("note", data.note);

            if (data.documents && data.documents.length > 0) {
                data.documents.forEach((file) => {
                    formData.append("documents", file);
                });
            }
            mutation.mutate({ id, data: formData });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <Visibility isLoading={isLoadingReport} fallback={<FormSkeleton />}>
                <h2 className="font-medium">Modification de l'état des lieux</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submit)}
                        className="space-y-4.5 w-full"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-neutral-600">Date<RequiredLabel /></FormLabel>
                                        <FormControl>
                                            <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.date} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tenant"
                                render={({ field, formState }) => (
                                    <SelectField
                                        label="Nom du locataire"
                                        required
                                        placeholder="Sélectionner un locataire"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={tenants}
                                        isLoading={isGettingTenants}
                                        hasError={!!formState.errors.tenant}
                                        emptyMessage="  Aucun locataire disponible"
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field, formState }) => (
                                    <SelectField
                                        label="Unité"
                                        required
                                        placeholder="Selectionner une unité"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={units}
                                        isLoading={isGettingUnits}
                                        hasError={!!formState.errors.unit}
                                        emptyMessage=" Aucune unité disponible"
                                    />
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Note<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Entrer la note"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.note}
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
                                        <InputFile value={field.value} onChange={field.onChange} error={form.formState.errors.documents?.message} />
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
