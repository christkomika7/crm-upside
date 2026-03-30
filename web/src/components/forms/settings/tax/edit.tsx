"use client"

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxSchema, type TaxSchemaType } from "@/lib/zod/settings";
import { type Tax } from "@/types/tax";
import { crudService } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import MultipleSelector from "@/components/ui/mullti-select";
import {
    EditIcon,
    XIcon,
    CheckIcon,
    Trash2Icon,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

type TaxRowProps = {
    tax: Tax;
    allTaxes: Tax[];
};

export default function Edit({ tax, allTaxes }: TaxRowProps) {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<TaxSchemaType>({
        resolver: zodResolver(taxSchema),
        defaultValues: {
            name: tax.name,
            rate: tax.value,
            cumul: tax.cumuls ?? [],
        },
    });

    const editTax = useMutation({
        mutationFn: ({ taxId, data }: { taxId: string; data: TaxSchemaType }) =>
            crudService.put(`/tax/${taxId}`, data),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeTax = useMutation({
        mutationFn: ({ taxId }: { taxId: string }) =>
            crudService.delete(`/tax/${taxId}`),
        onSuccess() {
            toast.success("Taxe supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
            queryClient.invalidateQueries({ queryKey: ["cumuls"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const selectedCumulNames = form.watch("cumul")?.map((c) => c.name) ?? [];

    const filteredTaxOptions = useMemo(() => {
        return allTaxes
            .filter((t) => t.id !== tax.id && !selectedCumulNames.includes(t.name))
            .map((t) => ({
                value: t.id,
                label: t.name,
                rate: t.value,
            }));
    }, [allTaxes, selectedCumulNames, tax.id]);

    useEffect(() => {
        form.watch(() => console.log({ error: form.formState.errors }))
    }, [form.watch])

    function handleStartEdit() {
        form.reset({
            name: tax.name,
            rate: tax.value,
            cumul: tax.cumuls ?? [],
        });
        setIsEditing(true);
    }

    function handleCancel() {
        form.reset({
            name: tax.name,
            rate: tax.value,
            cumul: tax.cumuls ?? [],
        });
        setIsEditing(false);
    }

    async function handleSubmit(formData: TaxSchemaType) {
        const { success, data } = taxSchema.safeParse(formData);
        if (!success) return;

        editTax.mutate(
            { taxId: tax.id, data },
            {
                onSuccess: () => {
                    toast.success("Taxe modifiée avec succès");
                    setIsEditing(false);
                    queryClient.invalidateQueries({ queryKey: ["taxes"] });
                    queryClient.invalidateQueries({ queryKey: ["cumuls"] });
                },
            }
        );
    }

    if (isEditing) {
        return (
            <div className="rounded-lg  bg-neutral-50/70 border border-input">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid grid-cols-[1fr_120px_1fr_88px] gap-3 px-4 py-3 items-start">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Nom de la taxe"
                                                className="h-9 bg-white"
                                                autoFocus
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                suffix="%"
                                                min={-100}
                                                max={100}
                                                placeholder="Taux"
                                                className="h-9 bg-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Cumuls */}
                            <FormField
                                control={form.control}
                                name="cumul"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MultipleSelector
                                                commandProps={{ label: "Cumul" }}
                                                value={
                                                    field.value?.map((item) => ({
                                                        value: item.id,
                                                        label: item.name,
                                                        rate: item.rate,
                                                    })) ?? []
                                                }
                                                onChange={(options) => {
                                                    const unique = Array.from(
                                                        new Map(options.map((o) => [o.value, o])).values()
                                                    );
                                                    field.onChange(
                                                        unique.map((opt) => {
                                                            const sourceTax = allTaxes.find((t) => t.id === opt.value);
                                                            return {
                                                                id: opt.value,
                                                                name: opt.label,
                                                                rate: sourceTax?.value ?? opt.rate ?? "0", // ✅ fallback sécurisé
                                                            };
                                                        })
                                                    );
                                                }}
                                                options={filteredTaxOptions}
                                                placeholder="Cumul avec..."
                                                hideClearAllButton
                                                hidePlaceholderWhenSelected
                                                emptyIndicator={
                                                    <p className="text-center text-sm py-1">
                                                        Aucun cumul disponible
                                                    </p>
                                                }
                                                className="bg-white min-h-9"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-1.5 justify-end pt-0.5">
                                <Button
                                    type="submit"
                                    disabled={editTax.isPending}
                                    size="sm"
                                    className="h-9 w-9 p-0 bg-emerald-500 hover:bg-emerald-600 text-white shadow-none"
                                >
                                    {editTax.isPending ? (
                                        <Spinner className="size-3.5" />
                                    ) : (
                                        <CheckIcon className="size-3.5" />
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 p-0 shadow-none"
                                >
                                    <XIcon className="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        );
    }

    return (
        <div className="group grid grid-cols-[1fr_120px_1fr_88px] gap-3 px-4 py-3 rounded-lg border border-transparent hover:border-border hover:bg-neutral-50/50 transition-all items-center">
            <span className="text-sm font-medium truncate">{tax.name}</span>
            <span className="text-sm text-muted-foreground">
                <span className="font-mono font-medium text-foreground">{tax.value}</span>
                <span className="text-muted-foreground ml-0.5">%</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
                {tax.cumuls && tax.cumuls.length > 0 ? (
                    tax.cumuls.map((cumul) => (
                        <Badge
                            key={cumul.id}
                            variant="secondary"
                            className="text-xs font-normal py-0 h-5"
                        >
                            {cumul.name}
                        </Badge>
                    ))
                ) : (
                    <span className="text-xs text-muted-foreground italic">Aucun</span>
                )}
            </div>

            <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    type="button"
                    onClick={handleStartEdit}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                    <EditIcon className="size-3.5" />
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={removeTax.isPending}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            {removeTax.isPending ? (
                                <Spinner className="size-3.5" />
                            ) : (
                                <Trash2Icon className="size-3.5" />
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la taxe</AlertDialogTitle>
                            <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer la taxe{" "}
                                <strong>{tax.name}</strong> ? Cette action est irréversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => removeTax.mutate({ taxId: tax.id })}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}