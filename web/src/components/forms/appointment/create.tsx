import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { appointmentSchema, type AppointmentSchemaType } from "@/lib/zod/appointment";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { Client } from "@/types/client";
import RequiredLabel from "@/components/ui/required-label";
import type { Member } from "@/types/user";
import MultipleSelector from "@/components/ui/mullti-select";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { formatTime } from "@/lib/utils";


export default function CreateAppointment() {
    const [type, setType] = useState<"OWNER" | "TENANT">("OWNER");

    const { isPending: isGettingClients, data: clients } = useQuery({
        queryKey: ["clients", type],
        enabled: !!type,
        queryFn: () => apiFetch<Client[]>(`/client/by?type=${type}`),
        select: (data) =>
            data.map((client) => ({
                value: client.id,
                label: `${client.firstname} ${client.lastname}`,
            })),
    });

    const { isPending: isGettingMembers, data: members } = useQuery({
        queryKey: ["members"],
        queryFn: () => apiFetch<Member[]>(`/users/member`),
        select: (data) =>
            data.map((member) => ({
                value: member.id,
                label: member.name,
            })),
    });


    const form = useForm<AppointmentSchemaType>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            type: "OWNER",
            date: new Date(),
            hour: "12",
            minutes: "00"
        },
    });


    const mutation = useMutation({
        mutationFn: (data: AppointmentSchemaType) =>
            crudService.post<AppointmentSchemaType, any>("/appointment/", data),
        onSuccess() {
            toast.success("Rendez-vous créé avec succès");
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            form.reset({
                type: "OWNER",
                date: new Date(),
                hour: "12",
                minutes: "00",
                client: "",
                teamMembers: [],
                note: "",
                subject: "",
                address: ""
            });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });


    async function submit(formData: AppointmentSchemaType) {
        const { success, data } = appointmentSchema.safeParse(formData);
        if (success) {
            mutation.mutate(data);
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations du rendez-vous</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-600">Type de client<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                                setType(e as "OWNER" | "TENANT");
                                            }}
                                            value={field.value}
                                        >
                                            <SelectTrigger
                                                className="w-full"
                                                aria-invalid={!!form.formState.errors.type}
                                            >
                                                <SelectValue placeholder="Selectionner un type de client" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="OWNER">Propriétaire</SelectItem>
                                                <SelectItem value="TENANT">Locataire</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="client"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-600">Client<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger
                                                className="w-full"
                                                aria-invalid={!!form.formState.errors.client}
                                            >
                                                <SelectValue placeholder="Selectionner un client" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {isGettingClients ? (
                                                    <div className="flex justify-center items-center">
                                                        <Spinner />
                                                    </div>
                                                ) : clients && clients.length > 0 ? (
                                                    clients.map((client) => (
                                                        <SelectItem key={client.value} value={client.value}>
                                                            {client.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>
                                                        Aucun client disponible
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-[2fr_1fr] gap-x-2">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-neutral-600">Date<RequiredLabel /></FormLabel>
                                        <FormControl>
                                            <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.date} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-[1fr_4px_1fr] gap-x-1">
                                <FormField
                                    control={form.control}
                                    name="hour"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel className="text-neutral-600">Heure<RequiredLabel /></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    integer
                                                    padded
                                                    min={0}
                                                    max={23}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(formatTime(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <span className="flex pt-5">
                                    <span className="h-10 flex items-center justify-center">:</span>
                                </span>
                                <FormField
                                    control={form.control}
                                    name="minutes"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel className="text-neutral-600">Min<RequiredLabel /></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    integer
                                                    padded
                                                    min={0}
                                                    max={59}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(formatTime(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Adresse<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'adresse"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.address}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Sujet<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le sujet du rendez-vous"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.subject}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="teamMembers"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Membres de l'équipe<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            commandProps={{ label: "Selection des membres de l'équipe" }}
                                            value={
                                                field.value?.map((item: string) => ({
                                                    value: item,
                                                    label: item,
                                                })) ?? []
                                            }
                                            onChange={(options) => {
                                                field.onChange(options.map((opt) => opt.value))
                                            }}
                                            isGettingData={isGettingMembers}
                                            defaultOptions={members}
                                            placeholder="Selectionnez des membres de l'équipe"
                                            hideClearAllButton
                                            hidePlaceholderWhenSelected
                                            emptyIndicator={
                                                <p className="text-center text-sm">Aucun membre sélectionné</p>
                                            }
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Note<RequiredLabel /></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Entrer la note du rendez-vous"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.note}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center">
                        <Button disabled={mutation.isPending} type="submit" variant="action" className="max-w-xl h-11">
                            {mutation.isPending ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
