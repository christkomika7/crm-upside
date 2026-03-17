import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { reservationSchema, type ReservationSchemaType } from "@/lib/zod/reservations";


export default function CreateReservation() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ReservationSchemaType>({
        resolver: zodResolver(reservationSchema),
    });

    async function submit(formData: ReservationSchemaType) {
        const { success, data } = reservationSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations de la reservation</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="prospect"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du prospect</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom du prospect"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.prospect}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Contact</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le numero du contact"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.contact}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date du début</FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.startDate} hasIcon={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date de fin</FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.endDate} hasIcon={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deposit"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le prix"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.deposit}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" variant="action" className="max-w-xl h-11">
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
