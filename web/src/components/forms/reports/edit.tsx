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
import { reportSchema, type ReportSchemaType } from "@/lib/zod/reports";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Unit } from "@/types/unit";
import { apiFetch, crudService } from "@/lib/api";
import type { Tenant } from "@/types/tenant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { DatePicker } from "@/components/ui/date-picker";
import type { Report } from "@/types/report";
import { urlToFile } from "@/lib/upload";

interface EditReportProps {
    id: string;
}

export default function EditReport({ id }: EditReportProps) {
    const [unit, setUnit] = useState<Partial<Unit> | null>(null);

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

    });


    const { isPending: isGettingTenants, data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => apiFetch<Tenant[]>("/tenant"),
        select: (data) => data.map((tenant) => ({
            value: tenant.id,
            label: `${tenant.firstname} ${tenant.lastname}`,
        })),
    });

    const { isPending: isGettingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: () => apiFetch<Unit[]>(`/unit`),
        select: (data) => data.map((unit) => ({
            value: unit.id,
            label: `${unit.reference}`,
            surface: unit.surface,
            rooms: unit.rooms,
            dining: unit.dining,
            bedroom: unit.bedroom,
            kitchen: unit.kitchen,
            bathroom: unit.bathroom,
        })),
    });

    const form = useForm<ReportSchemaType>({
        resolver: zodResolver(reportSchema),
    });

    useEffect(() => {
        if (report) {
            form.reset({
                date: new Date(report.date),
                tenant: report.tenantId,
                unit: report.unitId,
                note: report.note,
                documents: report.documents,
            })

            setUnit({
                surface: report.unit.surface,
                rooms: report.unit.rooms,
                dining: report.unit.dining,
                bedroom: report.unit.bedroom,
                kitchen: report.unit.kitchen,
                bathroom: report.unit.bathroom,
            })
        }
    }, [report])



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
            <h2 className="font-medium">Modification de l'état des lieux</h2>
            <Activity mode={isLoadingReport ? 'visible' : "hidden"}>
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
                            name="date"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date</FormLabel>
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
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du locataire</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger
                                                className="w-full"
                                                aria-invalid={!!form.formState.errors.tenant}
                                            >
                                                <SelectValue placeholder="Selectionner un locataire" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingTenants ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : tenants && tenants.length > 0 ? (
                                                    tenants.map((tenant) => (
                                                        <SelectItem key={tenant.value} value={tenant.value}>
                                                            {tenant.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        Aucun locataire disponible
                                                    </SelectItem>
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
                            name="unit"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Unité</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(e) => {
                                                field.onChange(e)
                                                setUnit(units?.find((unit) => unit.value === e) || null)
                                            }}
                                            value={field.value}
                                        >
                                            <SelectTrigger
                                                className="w-full"
                                                aria-invalid={!!form.formState.errors.unit}
                                            >
                                                <SelectValue placeholder="Selectionner une unité" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingUnits ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : units && units.length > 0 ? (
                                                    units.map((unit) => (
                                                        <SelectItem key={unit.value} value={unit.value}>
                                                            {unit.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        Aucune unité disponible
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <Label className="text-neutral-600">Dimensions</Label>
                            <Input
                                suffix="m²"
                                type="number"
                                disabled
                                value={unit?.surface}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-600">Pièce</Label>
                            <Input
                                type="number"
                                disabled
                                value={unit?.rooms}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-600">Salle à manger</Label>
                            <Input
                                type="number"
                                disabled
                                value={unit?.dining}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-600">Cuisine</Label>
                            <Input
                                type="number"
                                disabled
                                value={unit?.kitchen}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-600">Chambre</Label>
                            <Input
                                type="number"
                                disabled
                                value={unit?.bedroom}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-600">Salle de bain</Label>
                            <Input
                                type="number"
                                disabled
                                value={unit?.bathroom}
                            />
                        </div>

                    </div>
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Note</FormLabel>
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
        </div>
    )
}
