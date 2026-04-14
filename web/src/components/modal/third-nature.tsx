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
import { thirdNatureSchema, type ThirdNatureSchemaType } from "@/lib/zod/accounting";
import type { AccountElement } from "@/types/accounting";

type ThirdNatureModalProps = {
    secondNatureId: string;
    accountingType: "INFLOW" | "OUTFLOW";
}

export default function ThirdNatureModal({ secondNatureId, accountingType }: ThirdNatureModalProps) {

    const form = useForm<ThirdNatureSchemaType>({
        resolver: zodResolver(thirdNatureSchema),
        defaultValues: {
            name: "",
            secondNature: secondNatureId,
            accountingType,
        },
    });

    const { isPending, data: thirdNatures } = useQuery<AccountElement[]>({
        queryKey: ["thirdNatures", secondNatureId, accountingType],
        queryFn: () => apiFetch<AccountElement[]>(`/third-nature?secondNature=${secondNatureId}&accountingType=${accountingType}`),
    });

    const createThirdNature = useMutation({
        mutationFn: ({ data }: { data: ThirdNatureSchemaType }) =>
            crudService.post(`/third-nature`, data),
        onSuccess() {
            toast.success("Sous-nature ajoutée avec succès");
            queryClient.invalidateQueries({ queryKey: ["thirdNatures", accountingType] });
            queryClient.invalidateQueries({ queryKey: ["thirdNatures", secondNatureId, accountingType] });
            form.reset({ name: "", secondNature: secondNatureId, accountingType });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: ThirdNatureSchemaType) {
        const { success, data } = thirdNatureSchema.safeParse(formData);
        if (success) {
            createThirdNature.mutate({ data });
            form.reset({ name: "", secondNature: secondNatureId, accountingType });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !thirdNatures ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!thirdNatures || thirdNatures.length === 0) ? "visible" : "hidden"}>
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
            <Activity mode={thirdNatures && thirdNatures.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {thirdNatures?.map((thirdNature, index) => (
                        <ThirdNatureItem key={index} thirdNature={thirdNature} secondNatureId={secondNatureId} accountingType={accountingType} />
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
                            disabled={createThirdNature.isPending || isPending}
                            type="submit"
                            variant="action"
                            className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30"
                        >
                            {createThirdNature.isPending ? (
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


function ThirdNatureItem({ thirdNature, secondNatureId, accountingType }: { thirdNature: AccountElement; secondNatureId: string; accountingType: "INFLOW" | "OUTFLOW" }) {
    const [editing, setEditing] = useState(false);

    const form = useForm<ThirdNatureSchemaType>({
        resolver: zodResolver(thirdNatureSchema),
        defaultValues: {
            name: thirdNature.name,
            secondNature: secondNatureId,
            accountingType,
        },
    });

    const editThirdNature = useMutation({
        mutationFn: ({ thirdNatureId, data }: { thirdNatureId: string; data: ThirdNatureSchemaType }) =>
            crudService.put(`/third-nature/${thirdNatureId}`, data),
        onSuccess() {
            toast.success("Sous-nature modifiée avec succès");
            queryClient.invalidateQueries({ queryKey: ["thirdNatures", accountingType] });
            queryClient.invalidateQueries({ queryKey: ["thirdNatures", secondNatureId, accountingType] });
            form.reset({ name: "", secondNature: secondNatureId, accountingType });
            setEditing(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeThirdNature = useMutation({
        mutationFn: ({ thirdNatureId }: { thirdNatureId: string }) =>
            crudService.delete(`/third-nature/${thirdNatureId}`),
        onSuccess() {
            toast.success("Sous-nature supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["thirdNatures", accountingType] });
            queryClient.invalidateQueries({ queryKey: ["thirdNatures", secondNatureId, accountingType] });
            form.reset({ name: "", secondNature: secondNatureId, accountingType });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({ name: thirdNature.name, secondNature: secondNatureId, accountingType });
    }

    function cancel() {
        setEditing(false);
        form.reset({ name: thirdNature.name, secondNature: secondNatureId, accountingType });
    }

    async function submit(formData: ThirdNatureSchemaType) {
        const { success, data } = thirdNatureSchema.safeParse(formData);
        if (success) {
            editThirdNature.mutate({ thirdNatureId: thirdNature.id, data });
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
                                                disabled={editThirdNature.isPending}
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
                                    disabled={editThirdNature.isPending}
                                    className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5"
                                >
                                    {editThirdNature.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{thirdNature.name}</ItemTitle>
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
                            disabled={removeThirdNature.isPending}
                            onClick={() => removeThirdNature.mutate({ thirdNatureId: thirdNature.id })}
                            className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5"
                        >
                            {removeThirdNature.isPending ? (
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