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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MultipleSelector from "@/components/ui/mullti-select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";
import type { ProductService } from "@/types/product-service";
import { DatePicker } from "@/components/ui/date-picker";
import ArticleList from "./article-list";
import { PackageIcon, Trash2Icon } from "lucide-react";
import { Activity, useEffect } from "react";
import type { Tax } from "@/types/tax";
import RequiredLabel from "@/components/ui/required-label";
import type { ItemSchemaType } from "@/lib/zod/item";
import type { PurchaseOrder } from "@/types/purchase-order";
import type { ServiceProviderSelect } from "@/types/service-provider";
import { purchaseOrderSchema, type PurchaseOrderSchemaType } from "@/lib/zod/purchase-order";

export default function EditPurchaseOrder({ id }: { id: string }) {

    const { isPending: isGettingPurchaseOrder, data: purchaseOrder } = useQuery({
        queryKey: ["purchase-order", id],
        enabled: !!id,
        queryFn: () => apiFetch<PurchaseOrder>(`/purchase-order/${id}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const { isPending: isGettingServiceProviders, data: serviceProviders } = useQuery({
        queryKey: ["purchase-order-service-providers"],
        queryFn: () => apiFetch<ServiceProviderSelect[]>(`/purchase-order/service-provider`),
        select: (data) =>
            data.map((serviceProvider) => ({
                value: serviceProvider.id,
                label: `${serviceProvider.firstname} ${serviceProvider.lastname}`,
            })),
    });

    const { data: taxes } = useQuery({
        queryKey: ["taxes"],
        queryFn: () => apiFetch<Tax[]>(`/tax`),
        staleTime: 0,
    });

    const { isPending: isGettingItems, data: itemDatas } = useQuery({
        queryKey: ["product-services"],
        queryFn: () => apiFetch<ProductService[]>(`/product-service/`),
        select: (data) =>
            data.map((item) => ({
                id: item.id,
                value: item.reference,
                label: item.reference,
                description: item.description,
                price: item.price,
                hasTax: item.hasTax,
            })),
    });

    const form = useForm<PurchaseOrderSchemaType>({
        resolver: zodResolver(purchaseOrderSchema),
        defaultValues: {
            start: undefined,
            end: undefined,
            hasTax: false,
            price: "",
            discountType: "PERCENT",
            discount: "",
            items: [],
            serviceProvider: "",
            note: "",
        },
    });

    const items = form.watch("items") as ItemSchemaType[];
    const hasTax = form.watch("hasTax");
    const discountRaw = form.watch("discount");
    const discountType = form.watch("discountType");

    const discount: [number, "PERCENT" | "MONEY"] | undefined =
        discountRaw && Number(discountRaw) > 0
            ? [Number(discountRaw), discountType === "PERCENT" ? "PERCENT" : "MONEY"]
            : undefined;

    const mutation = useMutation({
        mutationFn: ({ purchaseOrderId, data }: { data: PurchaseOrderSchemaType, purchaseOrderId: string }) =>
            crudService.put<PurchaseOrderSchemaType, any>(`/purchase-order/${purchaseOrderId}`, data),
        onSuccess() {
            toast.success("Bon de commande modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["purchase-order", id] });
            queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    useEffect(() => {
        if (!purchaseOrder) return;

        form.reset({
            start: new Date(purchaseOrder.start),
            end: new Date(purchaseOrder.end),
            hasTax: purchaseOrder.hasTax,
            price: purchaseOrder.price,
            discountType: purchaseOrder.discountType,
            discount: purchaseOrder.discount,
            items: purchaseOrder.items.map((item) => ({
                id: item.productServiceId,
                reference: item.reference,
                description: item.description,
                price: Number(item.price),
                quantity: Number(item.quantity),
                hasTax: item.hasTax,
                discount: 0,
                discountType: "PERCENT",
            })),
            note: purchaseOrder.note,
            serviceProvider: purchaseOrder.serviceProviderId,
        });

    }, [purchaseOrder]);

    function handleItemsSelect(ids: string[]) {
        const selected = itemDatas?.filter((item) => ids.includes(item.value)) ?? [];
        const currentItems = form.getValues("items") as ItemSchemaType[];

        const merged: ItemSchemaType[] = ids.map((id) => {
            const existing = currentItems.find((i) => i.id === id);
            if (existing) return existing;
            const found = selected.find((s) => s.value === id)!;
            return {
                id: found.id,
                reference: found.label,
                description: found.description,
                price: Number(found.price),
                quantity: 1,
                hasTax: found.hasTax,
                discount: 0,
                discountType: "PERCENT" as const,
            };
        });

        form.setValue("items", merged, { shouldValidate: true });
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

    async function submit(formData: PurchaseOrderSchemaType) {
        const { success, data } = purchaseOrderSchema.safeParse(formData);
        if (success && purchaseOrder?.id) {
            mutation.mutate({ data, purchaseOrderId: purchaseOrder.id });
        }
    }

    const selectedItemReferences = items.map((i) => i.reference);

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Modification du bon de commande</h2>
            <Activity mode={isGettingPurchaseOrder ? 'visible' : "hidden"}>
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
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-600">Date d'échéance<RequiredLabel /></FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value}
                                                    setDate={field.onChange}
                                                    error={!!form.formState.errors.end}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="serviceProvider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-600">Fournisseur<RequiredLabel /></FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger
                                                    className="w-full"
                                                    aria-invalid={!!form.formState.errors.serviceProvider}
                                                >
                                                    <SelectValue placeholder="Selectionner un fournisseur" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingServiceProviders ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : serviceProviders && serviceProviders.length > 0 ? (
                                                        serviceProviders.map((serviceProvider) => (
                                                            <SelectItem key={serviceProvider.value} value={serviceProvider.value}>
                                                                {serviceProvider.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucun fournisseur disponible
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
                                name="items"
                                render={({ field }) => {
                                    const itemsError = form.formState.errors.items;
                                    return (
                                        <FormItem>
                                            <FormLabel className="text-neutral-600">
                                                Articles<RequiredLabel />
                                            </FormLabel>

                                            <FormControl>
                                                <MultipleSelector
                                                    error={!!itemsError}
                                                    commandProps={{ label: "Selection des articles" }}
                                                    value={selectedItemReferences.map((reference) => ({
                                                        value: reference,
                                                        label:
                                                            itemDatas?.find((d) => d.value === reference)?.label ??
                                                            reference,
                                                    }))}
                                                    onChange={(options) =>
                                                        handleItemsSelect(options.map((opt) => opt.value))
                                                    }
                                                    isGettingData={isGettingItems}
                                                    defaultOptions={itemDatas}
                                                    placeholder="Selectionnez des articles"
                                                    hideClearAllButton
                                                    hidePlaceholderWhenSelected
                                                    emptyIndicator={
                                                        <p className="text-center text-sm">
                                                            Aucun article sélectionné
                                                        </p>
                                                    }
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <ul className="flex flex-col">
                                                {Array.isArray(itemsError) &&
                                                    itemsError.map((itemError, index) => {
                                                        if (!itemError) return null;
                                                        return (
                                                            <li key={index} className="text-xs text-destructive">
                                                                {field.value[index].reference}
                                                                <br />
                                                                <div className="pl-1 border-l border-destructive">
                                                                    <p>{itemError.reference && ` ${itemError.reference.message}`}</p>
                                                                    <p>{itemError.description && ` ${itemError.description.message}`}</p>
                                                                    <p>{itemError.price && ` ${itemError.price.message}`}</p>
                                                                    <p>{itemError.quantity && ` ${itemError.quantity.message}`}</p>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

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
                                        className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors duration-150"
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
                                    taxes={taxes ?? []}
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