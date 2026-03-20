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
import { personalServiceSchema, type PersonalServiceSchemaType } from "@/lib/zod/property-management";
import type { PersonalService } from "@/types/personal-service";

export default function PersonalServiceModal() {

    const form = useForm<PersonalServiceSchemaType>({
        resolver: zodResolver(personalServiceSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isPending, data: personalServices } = useQuery<PersonalService[]>({
        queryKey: ["personal-services"],
        queryFn: () => apiFetch<PersonalService[]>("/personal-service/"),
    });

    const createPersonalService = useMutation({
        mutationFn: ({ data }: { data: PersonalServiceSchemaType }) =>
            crudService.post(`/personal-service`, data),
        onSuccess() {
            toast.success("Service personnel ajouté avec succès");
            queryClient.invalidateQueries({ queryKey: ["personal-services"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: PersonalServiceSchemaType) {
        const { success, data } = personalServiceSchema.safeParse(formData);
        if (success) {
            createPersonalService.mutate({ data });
            form.reset({
                name: ""
            });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !personalServices ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!personalServices || personalServices.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucun service personnel enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucun service personnel enregistré pour le moment. Veuillez en ajouter un pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={personalServices && personalServices.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {personalServices?.map((personalService, index) => (
                        <PersonalServiceItem key={index} personalService={personalService} />
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
                                            placeholder="Nom du service personnel"
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
                        <Button disabled={createPersonalService.isPending || isPending} type="submit" variant="action" className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30">
                            {createPersonalService.isPending ? (
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


function PersonalServiceItem({ personalService }: { personalService: PersonalService }) {
    const [editing, setEditing] = useState(false);
    const form = useForm<PersonalServiceSchemaType>({
        resolver: zodResolver(personalServiceSchema),
        defaultValues: {
            name: personalService.name,
        },
    });

    const editPersonalService = useMutation({
        mutationFn: ({ personalServiceId, data }: { personalServiceId: string, data: PersonalServiceSchemaType }) =>
            crudService.put(`/personal-service/${personalServiceId}`, data),
        onSuccess() {
            toast.success("Service personnel modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["personal-services"] });
            setEditing(false);
            form.reset({
                name: personalService.name,
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removePersonalService = useMutation({
        mutationFn: ({ personalServiceId }: { personalServiceId: string }) =>
            crudService.delete(`/personal-service/${personalServiceId}`),
        onSuccess() {
            toast.success("Service personnel supprimé avec succès");
            queryClient.invalidateQueries({ queryKey: ["personal-services"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({
            name: personalService.name,
        });
    }

    function cancel() {
        setEditing(false);
        form.reset({
            name: personalService.name,
        });
    }

    async function submit(formData: PersonalServiceSchemaType) {
        const { success, data } = personalServiceSchema.safeParse(formData);
        if (success) {
            editPersonalService.mutate({ personalServiceId: personalService.id, data });
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
                                                placeholder="Nom du service personnel"
                                                disabled={editPersonalService.isPending}
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
                                <button type="submit" disabled={editPersonalService.isPending} className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5">
                                    {editPersonalService.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{personalService.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                        <button type="button" onClick={() => edit()} className="cursor-pointer p-2 rounded-md text-amber-400 bg-amber-500/5 h-7.5 w-7.5"><EditIcon className="size-3.5" /></button>
                        <button type="button" disabled={removePersonalService.isPending} onClick={() => removePersonalService.mutate({ personalServiceId: personalService.id })} className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5">
                            {removePersonalService.isPending ? (
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

