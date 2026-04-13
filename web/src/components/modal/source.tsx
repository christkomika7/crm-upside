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
import { sourceSchema, type SourceSchemaType } from "@/lib/zod/accounting";
import type { AccountElement } from "@/types/accounting";

type SourceModalProps = {
    paymentMode: "CASH" | "BANK" | "CHECK";
}

export default function SourceModal({ paymentMode }: SourceModalProps) {

    const form = useForm<SourceSchemaType>({
        resolver: zodResolver(sourceSchema),
        defaultValues: {
            name: "",
            paymentMethod: paymentMode,
        },
    });

    const { isPending, data: sources } = useQuery<AccountElement[]>({
        queryKey: ["sources", paymentMode],
        queryFn: () => apiFetch<AccountElement[]>(`/source?paymentMethod=${paymentMode}`),
    });

    const createSource = useMutation({
        mutationFn: ({ data }: { data: SourceSchemaType }) =>
            crudService.post(`/source`, data),
        onSuccess() {
            toast.success("Source ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["sources", paymentMode] });
            form.reset({ name: "", paymentMethod: paymentMode });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: SourceSchemaType) {
        const { success, data } = sourceSchema.safeParse(formData);
        if (success) {
            createSource.mutate({ data });
            form.reset({ name: "", paymentMethod: paymentMode });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !sources ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!sources || sources.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucune source enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucune source enregistrée pour le moment. Veuillez en ajouter une pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={sources && sources.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {sources?.map((source, index) => (
                        <SourceItem key={index} source={source} paymentMode={paymentMode} />
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
                                            placeholder="Nom de la source"
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
                            disabled={createSource.isPending || isPending}
                            type="submit"
                            variant="action"
                            className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30"
                        >
                            {createSource.isPending ? (
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


function SourceItem({ source, paymentMode }: { source: AccountElement; paymentMode: "CASH" | "BANK" | "CHECK" }) {
    const [editing, setEditing] = useState(false);

    const form = useForm<SourceSchemaType>({
        resolver: zodResolver(sourceSchema),
        defaultValues: {
            name: source.name,
            paymentMethod: paymentMode,
        },
    });

    const editSource = useMutation({
        mutationFn: ({ sourceId, data }: { sourceId: string; data: SourceSchemaType }) =>
            crudService.put(`/source/${sourceId}`, data),
        onSuccess() {
            toast.success("Source modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["sources", paymentMode] });
            setEditing(false);
            form.reset({ name: source.name, paymentMethod: paymentMode });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeSource = useMutation({
        mutationFn: ({ sourceId }: { sourceId: string }) =>
            crudService.delete(`/source/${sourceId}`),
        onSuccess() {
            toast.success("Source supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["sources", paymentMode] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({ name: source.name, paymentMethod: paymentMode });
    }

    function cancel() {
        setEditing(false);
        form.reset({ name: source.name, paymentMethod: paymentMode });
    }

    async function submit(formData: SourceSchemaType) {
        const { success, data } = sourceSchema.safeParse(formData);
        if (success) {
            editSource.mutate({ sourceId: source.id, data });
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
                                                placeholder="Nom de la source"
                                                disabled={editSource.isPending}
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
                                    disabled={editSource.isPending}
                                    className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5"
                                >
                                    {editSource.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{source.name}</ItemTitle>
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
                            disabled={removeSource.isPending}
                            onClick={() => removeSource.mutate({ sourceId: source.id })}
                            className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5"
                        >
                            {removeSource.isPending ? (
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