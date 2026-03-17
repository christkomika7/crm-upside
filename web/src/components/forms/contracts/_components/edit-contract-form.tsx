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
import { contractSchema, type ContractSchemaType } from "@/lib/zod/contract";
import { DatePicker } from "@/components/ui/date-picker";


export default function EditContractForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ContractSchemaType>({
        resolver: zodResolver(contractSchema)
    });

    async function submit(formData: ContractSchemaType) {
        const { success, data } = contractSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations sur les contrats de bail</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="building"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du bâtiment</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.building}>
                                                <SelectValue placeholder="Selectionner un bâtiment" />
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
                            name="units"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Unité</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.units}>
                                                <SelectValue placeholder="Selectionner une unité" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="dark">12</SelectItem>
                                                <SelectItem value="light">4</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tenant"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du locataire</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.tenant}>
                                                <SelectValue placeholder="Selectionner un locataire" />
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
                            name="price"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prix</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le prix"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.price}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="managementFee"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Frais de gestion</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer les frais de gestion"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.managementFee}
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
                                    <FormLabel className="text-neutral-600">Date de début</FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.startDate} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Durée du contrat</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.duration}>
                                                <SelectValue placeholder="Selectionner la durée du contrat" />
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
                    <div className="flex justify-center gap-x-2">
                        <Button variant="inset-action" className="max-w-xl h-11" >Télécharger le fichier word</Button>
                        <Button type="submit" variant="action" className="max-w-xl h-11">
                            {isLoading ? (
                                <span className="flex justify-center items-center">
                                    <Spinner />
                                </span>
                            ) : (
                                "Modifier"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
