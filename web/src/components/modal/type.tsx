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
import { typeSchema, type TypeSchemaType } from "@/lib/zod/units";
import type { Type } from "@/types/type";

export default function TypeModal() {

    const form = useForm<TypeSchemaType>({
        resolver: zodResolver(typeSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isPending, data: types } = useQuery<Type[]>({
        queryKey: ["types"],
        queryFn: () => apiFetch<Type[]>("/type/"),
    });

    const createType = useMutation({
        mutationFn: ({ data }: { data: TypeSchemaType }) =>
            crudService.post(`/type`, data),
        onSuccess() {
            toast.success("Type ajouté avec succès");
            queryClient.invalidateQueries({ queryKey: ["types"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: TypeSchemaType) {
        const { success, data } = typeSchema.safeParse(formData);
        if (success) {
            createType.mutate({ data });
            form.reset({
                name: ""
            });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !types ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!types || types.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucun type  enregistré</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucun type enregistré pour le moment. Veuillez en ajouter un pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={types && types.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {types?.map((type, index) => (
                        <TypeItem key={index} type={type} />
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
                                <FormItem className="w-full" >
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            type="text"
                                            placeholder="Nom du type de lot"
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
                        <Button disabled={createType.isPending || isPending} type="submit" variant="action" className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30">
                            {createType.isPending ? (
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


function TypeItem({ type }: { type: Type }) {
    const [editing, setEditing] = useState(false);
    const form = useForm<TypeSchemaType>({
        resolver: zodResolver(typeSchema),
        defaultValues: {
            name: type.name,
        },
    });

    const editType = useMutation({
        mutationFn: ({ typeId, data }: { typeId: string, data: TypeSchemaType }) =>
            crudService.put(`/type/${typeId}`, data),
        onSuccess() {
            toast.success("Type modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["types"] });
            setEditing(false);
            form.reset({
                name: type.name,
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeType = useMutation({
        mutationFn: ({ typeId }: { typeId: string }) =>
            crudService.delete(`/type/${typeId}`),
        onSuccess() {
            toast.success("Type supprimé avec succès");
            queryClient.invalidateQueries({ queryKey: ["types"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({
            name: type.name,
        });
    }

    function cancel() {
        setEditing(false);
        form.reset({
            name: type.name,
        });
    }

    async function submit(formData: TypeSchemaType) {
        const { success, data } = typeSchema.safeParse(formData);
        if (success) {
            editType.mutate({ typeId: type.id, data });
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
                                    <FormItem className="w-full" >
                                        <FormControl>
                                            <Input
                                                className="w-full h-8"
                                                type="text"
                                                placeholder="Nom du type de lot"
                                                disabled={editType.isPending}
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
                                <button type="submit" disabled={editType.isPending} className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5">
                                    {editType.isPending ? (
                                        <span className="flex justify-center items-center">
                                            <Spinner />
                                        </span>
                                    ) : (
                                        <CheckIcon className="size-3.5" />
                                    )}
                                </button>
                                <button type="button" className="cursor-pointer p-2 rounded-md text-neutral-500 bg-neutral-500/5 h-7.5 w-7.5">
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
                        <ItemTitle className="text-sm font-normal">{type.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                        <button type="button" onClick={() => edit()} className="cursor-pointer p-2 rounded-md text-amber-400 bg-amber-500/5 h-7.5 w-7.5"><EditIcon className="size-3.5" /></button>
                        <button type="button" disabled={removeType.isPending} onClick={() => removeType.mutate({ typeId: type.id })} className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5">
                            {removeType.isPending ? (
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

