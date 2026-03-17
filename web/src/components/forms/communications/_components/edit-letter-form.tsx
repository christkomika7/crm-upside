import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";
import { communicationSchema, type CommunicationSchemaType } from "@/lib/zod/communication";


export default function EditLetterForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CommunicationSchemaType>({
        resolver: zodResolver(communicationSchema),
        defaultValues: {
            type: "letter",
        }
    });

    async function submit(formData: CommunicationSchemaType) {
        const { success, data } = communicationSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations de sortie</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="recipient"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Destinataire</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.recipient}>
                                                <SelectValue placeholder="Selectionner un destinataire" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="dark">Christ Komika</SelectItem>
                                                <SelectItem value="light">Orlando Komika</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="building"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Bâtiment</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.building}>
                                                <SelectValue placeholder="Selectionner un bâtiment" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="dark">Type 1</SelectItem>
                                                <SelectItem value="light">Type 2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Unité</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.unit}>
                                                <SelectValue placeholder="Selectionner une unité" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="dark">Christ Komika</SelectItem>
                                                <SelectItem value="light">Orlando Komika</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Entrer le message"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.message}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
