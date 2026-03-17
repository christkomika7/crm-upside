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


export default function EditAppointment() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AppointmentSchemaType>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            date: new Date()
        },
    });

    async function submit(formData: AppointmentSchemaType) {
        const { success, data } = appointmentSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
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
                            name="client"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Client</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.client}>
                                                <SelectValue placeholder="Selectionner un client" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="light">Mark</SelectItem>
                                                <SelectItem value="dark">John</SelectItem>
                                                <SelectItem value="system">Kassie</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date</FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.date} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Lieu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom du lieu"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.location}
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
                                    <FormLabel className="text-neutral-600">Sujet</FormLabel>
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
                    </div>
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Note</FormLabel>
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

                    <div className="flex justify-center gap-4">
                        <Button variant="outline" className="h-11.5! max-w-sm w-full" >Envoyer l'email</Button>
                        <Button type="submit" variant="action" className="max-w-sm h-11">
                            {isLoading ? (
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
