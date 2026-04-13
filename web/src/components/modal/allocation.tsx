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
import { allocationSchema, type AllocationSchemaType } from "@/lib/zod/accounting";
import type { AccountElement } from "@/types/accounting";

export default function AllocationModal() {

    const form = useForm<AllocationSchemaType>({
        resolver: zodResolver(allocationSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isPending, data: allocations } = useQuery<AccountElement[]>({
        queryKey: ["allocations"],
        queryFn: () => apiFetch<AccountElement[]>("/allocation/"),
    });

    const createAllocation = useMutation({
        mutationFn: ({ data }: { data: AllocationSchemaType }) =>
            crudService.post(`/allocation`, data),
        onSuccess() {
            toast.success("Allocation ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["allocations"] });
            form.reset({ name: "" });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: AllocationSchemaType) {
        const { success, data } = allocationSchema.safeParse(formData);
        if (success) {
            createAllocation.mutate({ data });
            form.reset({ name: "" });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !allocations ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!allocations || allocations.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucune allocation enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucune allocation enregistrée pour le moment. Veuillez en ajouter une pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={allocations && allocations.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {allocations?.map((allocation, index) => (
                        <AllocationItem key={index} allocation={allocation} />
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
                                            placeholder="Nom de l'allocation"
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
                            disabled={createAllocation.isPending || isPending}
                            type="submit"
                            variant="action"
                            className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30"
                        >
                            {createAllocation.isPending ? (
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


function AllocationItem({ allocation }: { allocation: AccountElement }) {
    const [editing, setEditing] = useState(false);

    const form = useForm<AllocationSchemaType>({
        resolver: zodResolver(allocationSchema),
        defaultValues: {
            name: allocation.name,
        },
    });

    const editAllocation = useMutation({
        mutationFn: ({ allocationId, data }: { allocationId: string; data: AllocationSchemaType }) =>
            crudService.put(`/allocation/${allocationId}`, data),
        onSuccess() {
            toast.success("Allocation modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["allocations"] });
            setEditing(false);
            form.reset({ name: allocation.name });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeAllocation = useMutation({
        mutationFn: ({ allocationId }: { allocationId: string }) =>
            crudService.delete(`/allocation/${allocationId}`),
        onSuccess() {
            toast.success("Allocation supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["allocations"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({ name: allocation.name });
    }

    function cancel() {
        setEditing(false);
        form.reset({ name: allocation.name });
    }

    async function submit(formData: AllocationSchemaType) {
        const { success, data } = allocationSchema.safeParse(formData);
        if (success) {
            editAllocation.mutate({ allocationId: allocation.id, data });
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
                                                placeholder="Nom de l'allocation"
                                                disabled={editAllocation.isPending}
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
                                    disabled={editAllocation.isPending}
                                    className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5"
                                >
                                    {editAllocation.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{allocation.name}</ItemTitle>
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
                            disabled={removeAllocation.isPending}
                            onClick={() => removeAllocation.mutate({ allocationId: allocation.id })}
                            className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5"
                        >
                            {removeAllocation.isPending ? (
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