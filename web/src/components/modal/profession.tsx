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
import { professionSchema, type ProfessionSchemaType } from "@/lib/zod/service-providers";
import type { Profession } from "@/types/profession";

export default function ProfessionModal() {

    const form = useForm<ProfessionSchemaType>({
        resolver: zodResolver(professionSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isPending, data: professions } = useQuery<Profession[]>({
        queryKey: ["professions"],
        queryFn: () => apiFetch<Profession[]>("/profession/"),
    });

    const createProfession = useMutation({
        mutationFn: ({ data }: { data: ProfessionSchemaType }) =>
            crudService.post(`/profession`, data),
        onSuccess() {
            toast.success("Profession ajouté avec succès");
            queryClient.invalidateQueries({ queryKey: ["professions"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: ProfessionSchemaType) {
        const { success, data } = professionSchema.safeParse(formData);
        if (success) {
            createProfession.mutate({ data });
            form.reset({
                name: ""
            });
        }
    }

    return (
        <div className="flex h-auto flex-col">
            <Activity mode={isPending && !professions ? "visible" : "hidden"}>
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            </Activity>
            <Activity mode={!isPending && (!professions || professions.length === 0) ? "visible" : "hidden"}>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BlocksIcon className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Aucune profession enregistrée</EmptyTitle>
                        <EmptyDescription>
                            Il n'y a aucune profession enregistrée pour le moment. Veuillez en ajouter une pour continuer.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </Activity>
            <Activity mode={professions && professions.length > 0 ? "visible" : "hidden"}>
                <ScrollArea className="space-y-2 h-full max-h-70 pr-3">
                    {professions?.map((profession, index) => (
                        <ProfessionItem key={index} profession={profession} />
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
                                            placeholder="Nom de la profession"
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
                        <Button disabled={createProfession.isPending || isPending} type="submit" variant="action" className="size-10! px-0! ring-0 bg-emerald-background/15 text-emerald-background hover:bg-emerald-background/30">
                            {createProfession.isPending ? (
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


function ProfessionItem({ profession }: { profession: Profession }) {
    const [editing, setEditing] = useState(false);
    const form = useForm<ProfessionSchemaType>({
        resolver: zodResolver(professionSchema),
        defaultValues: {
            name: profession.name,
        },
    });

    const editProfession = useMutation({
        mutationFn: ({ professionId, data }: { professionId: string, data: ProfessionSchemaType }) =>
            crudService.put(`/profession/${professionId}`, data),
        onSuccess() {
            toast.success("Profession modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["professions"] });
            setEditing(false);
            form.reset({
                name: profession.name,
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeProfession = useMutation({
        mutationFn: ({ professionId }: { professionId: string }) =>
            crudService.delete(`/profession/${professionId}`),
        onSuccess() {
            toast.success("Profession supprimé avec succès");
            queryClient.invalidateQueries({ queryKey: ["professions"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function edit() {
        setEditing(true);
        form.reset({
            name: profession.name,
        });
    }

    function cancel() {
        setEditing(false);
        form.reset({
            name: profession.name,
        });
    }

    async function submit(formData: ProfessionSchemaType) {
        const { success, data } = professionSchema.safeParse(formData);
        if (success) {
            editProfession.mutate({ professionId: profession.id, data });
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
                                                placeholder="Nom de la profession"
                                                disabled={editProfession.isPending}
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
                                <button type="submit" disabled={editProfession.isPending} className="cursor-pointer p-2 rounded-md text-emerald-500 bg-emerald-500/5 h-7.5 w-7.5">
                                    {editProfession.isPending ? (
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
                        <ItemTitle className="text-sm font-normal">{profession.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                        <button type="button" onClick={() => edit()} className="cursor-pointer p-2 rounded-md text-amber-400 bg-amber-500/5 h-7.5 w-7.5"><EditIcon className="size-3.5" /></button>
                        <button type="button" disabled={removeProfession.isPending} onClick={() => removeProfession.mutate({ professionId: profession.id })} className="cursor-pointer h-7.5 w-7.5 p-2 rounded-md text-destructive bg-destructive/5">
                            {removeProfession.isPending ? (
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

