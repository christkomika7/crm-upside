import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useState, type Dispatch, type SetStateAction } from "react"
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { paymentSchema, type PaymentSchemaType } from "@/lib/zod/payment";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

type CreatePaymentProps = {
    setOpen?: Dispatch<SetStateAction<boolean>>
}

export default function CreatePayment({ setOpen }: CreatePaymentProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PaymentSchemaType>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            markAsPaid: false,
            // date: new Date(),
        },
    });

    async function submit(formData: PaymentSchemaType) {
        const { success, data } = paymentSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full pt-2"
                >
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="markAsPaid"
                            render={({ field }) => (
                                <FormItem className="flex flex-row justify-between gap-x-2 items-center">
                                    <FormLabel className="text-neutral-600">Marquer comme payé</FormLabel>
                                    <FormControl>
                                        <Switch size="sm" checked={field.value} onCheckedChange={field.onChange} aria-invalid={!!form.formState.errors.amount} />
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
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.amount} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer une valeur"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.amount}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paymentMode"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.paymentMode}>
                                                <SelectValue placeholder="Selectionner une valeur" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="light">Caisse</SelectItem>
                                                <SelectItem value="dark">Banque</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <Textarea
                                            placeholder="Entrer une note"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.note}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className={cn("flex items-center gap-x-4",
                        {
                            "justify-between": setOpen,
                            "justify-center": !setOpen,
                        }
                    )}>
                        <Activity mode={setOpen ? "visible" : "hidden"} >
                            <Button type="reset" variant="outline-destructive" onClick={() => setOpen!(false)} className="w-fit">Annuler</Button>
                        </Activity>
                        <Button type="submit" variant="action" className={cn("h-11", {
                            "w-full": !setOpen,
                            "w-fit": setOpen,
                        })}>
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
