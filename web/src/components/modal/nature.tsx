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
import { natureSchema, type NatureSchemaType } from "@/lib/zod/accounting";
import type { AccountElement } from "@/types/accounting";

type NatureModalProps = {
    categoryId: string;
}

export default function NatureModal({ categoryId }: NatureModalProps) {

    const form = useForm<NatureSchemaType>({
        resolver: zodResolver(natureSchema),
        defaultValues: {
            name: "",
            category: categoryId,
        },
    });

    const { isPending, data: natures } = useQuery<AccountElement[]>({
        queryKey: ["natures", categoryId],
        queryFn: () => apiFetch<AccountElement[]>(`/nature?category=${categoryId}`),
    });

    const createNature = useMutation({
        mutationFn: ({ data }: { data: NatureSchemaType }) =>
            crudService.post(`/nature`, data),
        onSuccess() {
            toast.success("Nature ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["natures", categoryId] });
            form.reset({ name: "", category: categoryId });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: NatureSchemaType) {
        const { success, data } = natureSchema.safeParse(formData);
        if (success) {
            createNature.mutate({ data });
            form.reset({ name: "", category: categoryId });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !natures ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!natures || natures.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucune nature enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucune nature enregistrée pour le moment. Veuillez en ajouter une pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={natures && natures.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {natures?.map((nature, index) => (
                        <NatureItem key={index} nature={nature} categoryId={categoryId} />
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
                                            placeholder="Nom de la nature"
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
                            disabled={createNature.isPending || isPending}
                            type="submit"
                            variant="action"
                            className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30"
                        >
                            {createNature.isPending ? (
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


function NatureItem({ nature, categoryId }: { nature: AccountElement; categoryId: string }) {
    const [editing, setEditing] = useState(false);

    const form = useForm<NatureSchemaType>({
        resolver: zodResolver(natureSchema),
        defaultValues: {
            name: nature.name,
            category: categoryId,
        },
    });

    const editNature = useMutation({
        mutationFn: ({ natureId, data }: { natureId: string; data: NatureSchemaType }) =>
            crudService.put(`/nature/${natureId}`, data),
        onSuccess() {
            toast.success("Nature modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["natures", categoryId] });
            setEditing(false);
            form.reset({ name: nature.name, category: categoryId });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeNature = useMutation({
        mutationFn: ({ natureId }: { natureId: string }) =>
            crudService.delete(`/nature/${natureId}`),
        onSuccess() {
            toast.success("Nature supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["natures", categoryId] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({ name: nature.name, category: categoryId });
    }

    function cancel() {
        setEditing(false);
        form.reset({ name: nature.name, category: categoryId });
    }

    async function submit(formData: NatureSchemaType) {
        const { success, data } = natureSchema.safeParse(formData);
        if (success) {
            editNature.mutate({ natureId: nature.id, data });
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
                                                placeholder="Nom de la nature"
                                                disabled={editNature.isPending}
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
                                    disabled={editNature.isPending}
                                    className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5"
                                >
                                    {editNature.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{nature.name}</ItemTitle>
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
                            disabled={removeNature.isPending}
                            onClick={() => removeNature.mutate({ natureId: nature.id })}
                            className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5"
                        >
                            {removeNature.isPending ? (
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