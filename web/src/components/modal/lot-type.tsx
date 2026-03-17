import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { apiFetch, crudService } from "@/lib/api";
import type { LotType } from "@/types/lot-type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { BlocksIcon, CheckIcon, EditIcon, PlusIcon, RedoIcon, XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lotTypeSchema, type LotTypeSchemaType } from "@/lib/zod/building";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Activity, useState } from "react";

export default function LotTypeModal() {

    const form = useForm<LotTypeSchemaType>({
        resolver: zodResolver(lotTypeSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isPending, data: lotTypes } = useQuery<LotType[]>({
        queryKey: ["lot-types"],
        queryFn: () => apiFetch<LotType[]>("/lot-type/"),
    });

    const createLotType = useMutation({
        mutationFn: ({ data }: { data: LotTypeSchemaType }) =>
            crudService.post(`/lot-type`, data),
        onSuccess() {
            toast.success("Type de lot ajouté avec succès");
            queryClient.invalidateQueries({ queryKey: ["lot-types"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: LotTypeSchemaType) {
        const { success, data } = lotTypeSchema.safeParse(formData);
        if (success) {
            createLotType.mutate({ data });
            form.reset({
                name: ""
            });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !lotTypes ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!lotTypes || lotTypes.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucun type de lot enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucun type de lot enregistré pour le moment. Veuillez en ajouter un pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={lotTypes && lotTypes.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {lotTypes?.map((lotType, index) => (
                        <LotTypeItem key={index} lotType={lotType} />
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
                        <Button disabled={createLotType.isPending || isPending} type="submit" variant="action" className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30">
                            {createLotType.isPending ? (
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


function LotTypeItem({ lotType }: { lotType: LotType }) {
    const [editing, setEditing] = useState(false);
    const form = useForm<LotTypeSchemaType>({
        resolver: zodResolver(lotTypeSchema),
        defaultValues: {
            name: lotType.name,
        },
    });

    const editLotType = useMutation({
        mutationFn: ({ lotTypeId, data }: { lotTypeId: string, data: LotTypeSchemaType }) =>
            crudService.put(`/lot-type/${lotTypeId}`, data),
        onSuccess() {
            toast.success("Type de lot modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["lot-types"] });
            setEditing(false);
            form.reset({
                name: lotType.name,
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeLotType = useMutation({
        mutationFn: ({ lotTypeId }: { lotTypeId: string }) =>
            crudService.delete(`/lot-type/${lotTypeId}`),
        onSuccess() {
            toast.success("Type de lot supprimé avec succès");
            queryClient.invalidateQueries({ queryKey: ["lot-types"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({
            name: lotType.name,
        });
    }

    function cancel() {
        setEditing(false);
        form.reset({
            name: lotType.name,
        });
    }

    async function submit(formData: LotTypeSchemaType) {
        const { success, data } = lotTypeSchema.safeParse(formData);
        if (success) {
            editLotType.mutate({ lotTypeId: lotType.id, data });
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
                                                disabled={editLotType.isPending}
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
                                <button type="submit" disabled={editLotType.isPending} className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5">
                                    {editLotType.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{lotType.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                        <button type="button" onClick={() => edit()} className="cursor-pointer p-2 rounded-md text-amber-400 bg-amber-500/5 h-7.5 w-7.5"><EditIcon className="size-3.5" /></button>
                        <button type="button" disabled={removeLotType.isPending} onClick={() => removeLotType.mutate({ lotTypeId: lotType.id })} className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5">
                            {removeLotType.isPending ? (
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

