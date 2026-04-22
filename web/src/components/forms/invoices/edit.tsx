"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
    invoiceSchema,
    type InvoiceSchemaType,
} from "@/lib/zod/invoices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Invoice } from "@/types/invoice";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { PackageIcon, Trash2Icon } from "lucide-react";
import { Activity, useEffect, useRef, useState } from "react";
import type { Tax } from "@/types/tax";
import type { Client } from "@/types/client";
import type { ItemSchemaType } from "@/lib/zod/item";
import { DEFAULT_VALUES } from "./lib/utils";
import type { Article } from "@/types/item";
import { SelectField } from "@/components/ui/select-field";
import { dueDates } from "@/lib/data";

import MultipleSelector from "@/components/ui/mullti-select";
import ArticleList from "./article-list";
import RequiredLabel from "@/components/ui/required-label";
import Decimal from "decimal.js";

export default function EditInvoices({ id }: { id: string }) {
    const form = useForm<InvoiceSchemaType>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: DEFAULT_VALUES
    });

    const items = form.watch("items") as ItemSchemaType[];
    const hasTax = form.watch("hasTax");
    const discountRaw = form.watch("discount");
    const discountType = form.watch("discountType");

    const initialized = useRef(false);
    const [type, setType] = useState<"OWNER" | "TENANT">("OWNER");

    const { isPending: isGettingInvoice, data: invoice } = useQuery({
        queryKey: ["invoice", id],
        enabled: !!id,
        queryFn: () => apiFetch<Invoice>(`/invoice/${id}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const { isPending: isGettingClients, data: clients } = useQuery({
        queryKey: ["clients", type],
        enabled: !!type,
        queryFn: () => apiFetch<Client[]>(`/client/by?type=${type}`),
        select: (data) =>
            data.map((client) => ({
                value: client.id,
                label: `${client.firstname} ${client.lastname}`,
            })),
        staleTime: 0,
    });

    const { data: taxes } = useQuery({
        queryKey: ["taxes"],
        queryFn: () => apiFetch<Tax[]>(`/tax`),
        staleTime: 0,
    });

    const { isPending: isGettingItems, data: itemDatas } = useQuery({
        queryKey: ["product-services"],
        queryFn: () => apiFetch<Article[]>(`/product-service/`),
        select: (data) =>
            data.map((item) => ({
                id: item.id,
                type: "ITEM",
                value: item.reference,
                label: item.reference,
                description: item.description,
                price: item.price,
                charges: "",
                extraCharges: "",
                hasTax: item.hasTax,
            })),
    });

    const { isPending: isGettingUnits, data: units } = useQuery({
        queryKey: ["units"],
        queryFn: () => apiFetch<Article[]>(`/unit/list`),
        select: (data) =>
            data.map((unit) => ({
                id: unit.id,
                type: "UNIT",
                value: unit.reference,
                label: unit.reference,
                price: unit.rent,
                charges: unit.charges,
                extraCharges: unit.extraCharges,
                description: "A modern 2-bedroom apartment located in the Sunset Heights building. The unit spans 120 m² with a spacious living area, balcony view, and dedicated parking. Currently rented to David Lee, generating $1,200 monthly rent + $150 charges. Equipped with water, electricity, and Wi-Fi services.",
                hasTax: false,
            })),
    });

    const discount: [number, "PERCENT" | "MONEY"] | undefined =
        discountRaw && Number(discountRaw) > 0
            ? [Number(discountRaw), discountType === "PERCENT" ? "PERCENT" : "MONEY"]
            : undefined;

    const mutation = useMutation({
        mutationFn: ({ invoiceId, data }: { data: InvoiceSchemaType, invoiceId: string }) =>
            crudService.put<InvoiceSchemaType, any>(`/invoice/${invoiceId}`, data),
        onSuccess() {
            toast.success("Facture modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (!invoice) return;
        form.reset({
            start: new Date(invoice.start),
            end: invoice.end,
            hasTax: invoice.hasTax,
            price: invoice.price,
            type: invoice.type,
            discountType: invoice.discountType,
            discount: invoice.discount,
            items: invoice.items.map((item) => ({
                ...(item.type === "ITEM" ? { id: item.productServiceId } : { id: item.unitId }),
                ...(item.type === "UNIT" ? {
                    charges: Number(item.charges),
                    extraCharges: Number(item.extraCharges),
                    ...(item.start && item.end && {
                        start: new Date(item.start),
                        end: new Date(item.end)
                    })
                } : {}),
                type: item.type,
                reference: item.reference,
                description: item.description,
                price: Number(item.price),
                quantity: Number(item.quantity),
                hasTax: item.hasTax,
                discount: 0,
                discountType: "PERCENT",
            })),
            period: invoice.period || "",
            note: invoice.note,
            client: "",
        });

        setType(invoice.type);
    }, [invoice]);


    useEffect(() => {
        if (!invoice || !clients || initialized.current) return;
        const clientId =
            invoice.type === "OWNER"
                ? invoice.ownerId
                : invoice.tenantId;
        form.setValue("client", clientId ?? "");
        initialized.current = true;
    }, [invoice, clients, form.setValue]);

    function handleItemsSelect(selectedValues: string[], itemType: "ITEM" | "UNIT") {
        const sourceData = itemType === "ITEM" ? (itemDatas ?? []) : (units ?? []);
        const currentItems = form.getValues("items") as ItemSchemaType[];

        const itemsOfOtherType = currentItems.filter((i) => i.type !== itemType);
        const itemsOfSameType = currentItems.filter((i) => i.type === itemType);

        const newItemsOfSameType: ItemSchemaType[] = selectedValues.map((val) => {
            const existing = itemsOfSameType.find((i) => i.reference === val);
            if (existing) return existing;

            const found = sourceData.find((s) => s.value === val)!;
            return {
                id: found.id,
                type: itemType,
                reference: found.label,
                description: found.description ?? "",
                price: Number(found.price),
                charges: Number(found.charges || 0),
                extraCharges: Number(found.extraCharges || 0),
                start: undefined,
                end: undefined,
                quantity: 1,
                hasTax: found.hasTax,
                discount: 0,
                discountType: "PERCENT" as const,
            };
        });

        form.setValue("items", [...itemsOfOtherType, ...newItemsOfSameType], {
            shouldValidate: true,
        });
    }

    function handleArticleListChange(updatedItems: ItemSchemaType[]) {
        form.setValue("items", updatedItems, { shouldValidate: true });
    }

    function handlePriceChange(price: string) {
        form.setValue("price", price, { shouldValidate: true });
    }

    function clearItems() {
        form.setValue("items", [], { shouldValidate: true });
    }

    const selectedItemValues = items
        .filter((i) => i.type === "ITEM")
        .map((i) => ({ value: i.reference, label: i.reference }));

    const selectedUnitValues = items
        .filter((i) => i.type === "UNIT")
        .map((i) => ({ value: i.reference, label: i.reference }));

    async function submit(formData: InvoiceSchemaType) {
        const { success, data } = invoiceSchema.safeParse(formData);
        if (success && invoice?.id) {
            mutation.mutate({ data, invoiceId: invoice.id });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Modification de la facture</h2>
            <Activity mode={isGettingInvoice ? 'visible' : "hidden"}>
                <Spinner />
            </Activity>
            <Form {...form}>
                <form key={id} onSubmit={form.handleSubmit(submit)} className="space-y-4.5 w-full">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4.5">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-600">Date d'émission<RequiredLabel /></FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value}
                                                    setDate={field.onChange}
                                                    error={!!form.formState.errors.start}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end"
                                    render={({ field, formState }) => (
                                        <SelectField
                                            label="Échéance"
                                            required
                                            placeholder="Sélectionner une échéance"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            options={dueDates}
                                            hasError={!!formState.errors.end}
                                            emptyMessage="Aucune échéance disponible"
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field, formState }) => (
                                        <SelectField
                                            label="Type de client"
                                            required
                                            placeholder="Sélectionner un type de client"
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setType(e as "OWNER" | "TENANT");
                                                form.setValue('client', '');
                                            }}
                                            options={[
                                                { value: "OWNER", label: "Propriétaire" },
                                                { value: "TENANT", label: "Locataire" },
                                            ]}
                                            hasError={!!formState.errors.type}
                                            emptyMessage="Aucun type de client disponible"
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client"
                                    render={({ field }) => (
                                        <SelectField
                                            label="Client"
                                            required
                                            placeholder="Sélectionner un client"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            options={clients}
                                            isLoading={isGettingClients}
                                            hasError={!!form.formState.errors.client}
                                            emptyMessage="Aucun client disponible"
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-600">Articles<RequiredLabel /></FormLabel>
                                            <FormControl>
                                                <MultipleSelector
                                                    commandProps={{ label: "Selection des articles" }}
                                                    value={selectedItemValues}
                                                    onChange={(options) =>
                                                        handleItemsSelect(options.map((opt) => opt.value), "ITEM")
                                                    }
                                                    isGettingData={isGettingItems}
                                                    defaultOptions={itemDatas}
                                                    placeholder="Selectionnez des articles"
                                                    hideClearAllButton
                                                    hidePlaceholderWhenSelected
                                                    emptyIndicator={
                                                        <p className="text-center text-sm">Aucun article sélectionné</p>
                                                    }
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-600">Unités<RequiredLabel /></FormLabel>
                                            <FormControl>
                                                <MultipleSelector
                                                    commandProps={{ label: "Selection des unités" }}
                                                    value={selectedUnitValues}
                                                    onChange={(options) =>
                                                        handleItemsSelect(options.map((opt) => opt.value), "UNIT")
                                                    }
                                                    isGettingData={isGettingUnits}
                                                    defaultOptions={units?.map((u) => ({
                                                        value: u.value,
                                                        label: u.label,
                                                        description: u.description,
                                                        price: new Decimal(u.price || 0).plus(new Decimal(u.charges || 0)).plus(new Decimal(u.extraCharges || 0)).toString(),
                                                        hasTax: u.hasTax,
                                                    }))}
                                                    placeholder="Selectionnez des unités"
                                                    hideClearAllButton
                                                    hidePlaceholderWhenSelected
                                                    emptyIndicator={
                                                        <p className="text-center text-sm">Aucune unité disponible</p>
                                                    }
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <Label className="text-neutral-600 mb-0.5 relative -top-0.5 text-sm font-medium p-0">
                                        TVA
                                    </Label>
                                    <FormField
                                        control={form.control}
                                        name="hasTax"
                                        render={({ field }) => (
                                            <FormItem
                                                className={cn(
                                                    "flex flex-row gap-x-2 justify-between items-center px-3 h-10 border-border border rounded-md",
                                                    {
                                                        "bg-emerald-50 border-emerald-background ring-emerald-background/50 ring-[3px]":
                                                            field.value,
                                                    }
                                                )}
                                            >
                                                <FormLabel className="text-neutral-600 w-full h-full">
                                                    Appliquer la TVA
                                                </FormLabel>
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

                                <div className="flex gap-1">
                                    <FormField
                                        control={form.control}
                                        name="discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-600">Réduction</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Taux de réduction"
                                                        value={field.value}
                                                        aria-invalid={!!form.formState.errors.discount}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="discountType"
                                        render={({ field }) => (
                                            <FormItem className="flex justify-end">
                                                <FormControl>
                                                    <div className="flex rounded-md border border-neutral-200 bg-neutral-50 p-0.5 gap-0.5 w-20">
                                                        {(
                                                            [
                                                                { value: "PERCENT", label: "%" },
                                                                { value: "MONEY", label: "$" },
                                                            ] as const
                                                        ).map(({ value, label }) => {
                                                            const isActive = field.value === value;
                                                            return (
                                                                <button
                                                                    key={value}
                                                                    type="button"
                                                                    onClick={() => field.onChange(value)}
                                                                    className={cn(
                                                                        "flex-1 h-8 rounded-md text-sm font-medium transition-all duration-150",
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
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="period"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-600">Période</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Période"
                                                value={field.value}
                                                aria-invalid={!!form.formState.errors.period}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-600">Note</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Entrez la note"
                                                value={field.value}
                                                aria-invalid={!!form.formState.errors.note}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-center">
                                <Button
                                    disabled={mutation.isPending}
                                    type="submit"
                                    variant="action"
                                    className="h-11"
                                >
                                    {mutation.isPending ? (
                                        <span className="flex justify-center items-center">
                                            <Spinner />
                                        </span>
                                    ) : (
                                        "Modifier"
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3 p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-medium text-neutral-800">
                                        Liste des articles
                                    </h2>
                                    {items.length > 0 && (
                                        <p className="text-xs text-neutral-400 mt-0.5">
                                            {items.length} article{items.length > 1 ? "s" : ""}
                                        </p>
                                    )}
                                </div>
                                {items.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearItems}
                                        className="flex items-center cursor-pointer gap-1.5 text-xs text-neutral-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors duration-150"
                                    >
                                        <Trash2Icon className="size-3" />
                                        Vider
                                    </button>
                                )}
                            </div>

                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-10 border border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                                    <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center">
                                        <PackageIcon className="size-4 text-neutral-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-neutral-600">
                                            Aucun article ajouté
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-0.5">
                                            Ajoutez des articles pour les voir apparaître ici
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <ArticleList
                                    items={items}
                                    taxes={taxes}
                                    discount={discount}
                                    amountType={hasTax ? "TTC" : "HT"}
                                    onChange={handleArticleListChange}
                                    onChangePrice={handlePriceChange}
                                />
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}