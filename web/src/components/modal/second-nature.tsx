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
import { secondNatureSchema, type SecondNatureSchemaType } from "@/lib/zod/accounting";
import type { AccountElement } from "@/types/accounting";

type SecondNatureModalProps = {
    natureId: string;
}

export default function SecondNatureModal({ natureId }: SecondNatureModalProps) {

    const form = useForm<SecondNatureSchemaType>({
        resolver: zodResolver(secondNatureSchema),
        defaultValues: {
            name: "",
            nature: natureId,
        },
    });

    const { isPending, data: secondNatures } = useQuery<AccountElement[]>({
        queryKey: ["secondNatures", natureId],
        queryFn: () => apiFetch<AccountElement[]>(`/second-nature?natureId=${natureId}`),
    });

    const createSecondNature = useMutation({
        mutationFn: ({ data }: { data: SecondNatureSchemaType }) =>
            crudService.post(`/second-nature`, data),
        onSuccess() {
            toast.success("Sous-nature ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["secondNatures", natureId] });
            form.reset({ name: "", nature: natureId });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: SecondNatureSchemaType) {
        const { success, data } = secondNatureSchema.safeParse(formData);
        if (success) {
            createSecondNature.mutate({ data });
            form.reset({ name: "", nature: natureId });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !secondNatures ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!secondNatures || secondNatures.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucune sous-nature enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucune sous-nature enregistrée pour le moment. Veuillez en ajouter une pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={secondNatures && secondNatures.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {secondNatures?.map((secondNature, index) => (
                        <SecondNatureItem key={index} secondNature={secondNature} natureId={natureId} />
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
                                            placeholder="Nom de la sous-nature"
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
                            disabled={createSecondNature.isPending || isPending}
                            type="submit"
                            variant="action"
                            className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30"
                        >
                            {createSecondNature.isPending ? (
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


function SecondNatureItem({ secondNature, natureId }: { secondNature: AccountElement; natureId: string }) {
    const [editing, setEditing] = useState(false);

    const form = useForm<SecondNatureSchemaType>({
        resolver: zodResolver(secondNatureSchema),
        defaultValues: {
            name: secondNature.name,
            nature: natureId,
        },
    });

    const editSecondNature = useMutation({
        mutationFn: ({ secondNatureId, data }: { secondNatureId: string; data: SecondNatureSchemaType }) =>
            crudService.put(`/second-nature/${secondNatureId}`, data),
        onSuccess() {
            toast.success("Sous-nature modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["secondNatures", natureId] });
            setEditing(false);
            form.reset({ name: secondNature.name, nature: natureId });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeSecondNature = useMutation({
        mutationFn: ({ secondNatureId }: { secondNatureId: string }) =>
            crudService.delete(`/second-nature/${secondNatureId}`),
        onSuccess() {
            toast.success("Sous-nature supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["secondNatures", natureId] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({ name: secondNature.name, nature: natureId });
    }

    function cancel() {
        setEditing(false);
        form.reset({ name: secondNature.name, nature: natureId });
    }

    async function submit(formData: SecondNatureSchemaType) {
        const { success, data } = secondNatureSchema.safeParse(formData);
        if (success) {
            editSecondNature.mutate({ secondNatureId: secondNature.id, data });
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
                                                placeholder="Nom de la sous-nature"
                                                disabled={editSecondNature.isPending}
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
                                    disabled={editSecondNature.isPending}
                                    className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5"
                                >
                                    {editSecondNature.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{secondNature.name}</ItemTitle>
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
                            disabled={removeSecondNature.isPending}
                            onClick={() => removeSecondNature.mutate({ secondNatureId: secondNature.id })}
                            className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5"
                        >
                            {removeSecondNature.isPending ? (
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