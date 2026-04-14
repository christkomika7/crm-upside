import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { apiFetch, crudService } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { BlocksIcon, CheckIcon, EditIcon, PlusIcon, RedoIcon, XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Activity, useState } from "react";
import { categorySchema, type CategorySchemaType } from "@/lib/zod/accounting";
import type { AccountElement } from "@/types/accounting";

export default function CategoryModal({ accountingType }: { accountingType: "INFLOW" | "OUTFLOW" }) {

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            accountingType,
        },
    });

    const { isPending, data: categories } = useQuery<AccountElement[]>({
        queryKey: ["categories", accountingType],
        queryFn: () => apiFetch<AccountElement[]>("/category?accountingType=" + accountingType),
    });

    const createCategory = useMutation({
        mutationFn: ({ data }: { data: CategorySchemaType }) =>
            crudService.post(`/category`, data),
        onSuccess() {
            toast.success("Catégorie ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["categories", accountingType] });
            form.reset({ name: "", accountingType });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: CategorySchemaType) {
        const { success, data } = categorySchema.safeParse(formData);
        if (success) {
            createCategory.mutate({ data });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !categories ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!categories || categories.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucune catégorie enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucune catégorie enregistrée pour le moment. Veuillez en ajouter une pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={categories && categories.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {categories?.map((category, index) => (
                        <CategoryItem key={index} category={category} accountingType={accountingType} />
                    ))}
                </ScrollArea>
            </Activity>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-2.5 w-full"
                >
                    <div className="flex gap-x-2.5 py-2 pl-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            type="text"
                                            placeholder="Nom de la catégorie"
                                            disabled={isPending}
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.name}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={createCategory.isPending || isPending}
                            type="submit"
                            variant="action"
                            className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30"
                        >
                            {createCategory.isPending ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                <PlusIcon className="size-4" />
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}


function CategoryItem({ category, accountingType }: { category: AccountElement, accountingType: "INFLOW" | "OUTFLOW" }) {
    const [editing, setEditing] = useState(false);

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category.name,
            accountingType,
        },
    });

    const editCategory = useMutation({
        mutationFn: ({ categoryId, data }: { categoryId: string; data: CategorySchemaType }) =>
            crudService.put(`/category/${categoryId}`, data),
        onSuccess() {
            toast.success("Catégorie modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["categories", accountingType] });
            setEditing(false);
            form.reset({ name: category.name, accountingType });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeCategory = useMutation({
        mutationFn: ({ categoryId }: { categoryId: string }) =>
            crudService.delete(`/category/${categoryId}`),
        onSuccess() {
            toast.success("Catégorie supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["categories", accountingType] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({ name: category.name, accountingType });
    }

    function cancel() {
        setEditing(false);
        form.reset({ name: category.name, accountingType });
    }

    async function submit(formData: CategorySchemaType) {
        const { success, data } = categorySchema.safeParse(formData);
        if (success) {
            editCategory.mutate({ categoryId: category.id, data });
        }
    }

    return (
        <>
            <Activity mode={editing ? "visible" : "hidden"}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submit)}
                        className="space-y-2.5 w-full"
                    >
                        <div className="flex gap-x-2.5 py-2 px-1.5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                className="w-full h-8"
                                                type="text"
                                                placeholder="Nom de la catégorie"
                                                disabled={editCategory.isPending}
                                                value={field.value}
                                                aria-invalid={!!form.formState.errors.name}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-x-2">
                                <button
                                    type="submit"
                                    disabled={editCategory.isPending}
                                    className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5"
                                >
                                    {editCategory.isPending ? (
                                        <span className="flex justify-center items-center">
                                            <Spinner />
                                        </span>
                                    ) : (
                                        <CheckIcon className="size-3.5" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="cursor-pointer p-2 rounded-md text-neutral-500 bg-neutral-500/5 h-7.5 w-7.5"
                                >
                                    <RedoIcon className="size-3.5" onClick={() => cancel()} />
                                </button>
                            </div>
                        </div>
                    </form>
                </Form>
            </Activity>
            <Activity mode={!editing ? "visible" : "hidden"}>
                <Item className="hover:bg-green-50 pl-2 pr-1 py-1 gap-x-2">
                    <ItemMedia>
                        <BlocksIcon className="size-4 text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="text-sm font-normal">{category.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                        <button
                            type="button"
                            onClick={() => edit()}
                            className="cursor-pointer p-2 rounded-md text-amber-400 bg-amber-500/5 h-7.5 w-7.5"
                        >
                            <EditIcon className="size-3.5" />
                        </button>
                        <button
                            type="button"
                            disabled={removeCategory.isPending}
                            onClick={() => removeCategory.mutate({ categoryId: category.id })}
                            className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5"
                        >
                            {removeCategory.isPending ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                <XIcon className="size-3.5" />
                            )}
                        </button>
                    </ItemActions>
                </Item>
            </Activity>
        </>
    )
}