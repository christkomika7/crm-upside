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
import InputFile from "@/components/ui/input-file";
import { reportSchema, type ReportSchemaType } from "@/lib/zod/reports";
import { Textarea } from "@/components/ui/textarea";


export default function CreateReport() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ReportSchemaType>({
        resolver: zodResolver(reportSchema),
    });

    async function submit(formData: ReportSchemaType) {
        const { success, data } = reportSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations d’enregistrement</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="tenant"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom du locataire</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.tenant}>
                                                <SelectValue placeholder="Selectionner une valeur" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="lessie">Lessie</SelectItem>
                                                <SelectItem value="monica">Monica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="propertyOrUnit"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom de l'unité ou du bien immobilier</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.propertyOrUnit}>
                                                <SelectValue placeholder="Selectionner une valeur" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                <SelectItem value="lessie">Lessie</SelectItem>
                                                <SelectItem value="monica">Monica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Dimension</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer la dimension"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.size}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="livingRoom"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Chambre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer la chambre"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.livingRoom}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dining"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Salle à manger</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer la salle à manger"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.dining}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kitchen"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Cuisine</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer la cuisine"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.kitchen}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Chambres</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de chambres"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.bedrooms}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Salles de bain</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le nombre de salles de bain"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.bathrooms}
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
                                        placeholder="Entrer la note"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.note}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="documents"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <InputFile value={field.value} onChange={field.onChange} error={form.formState.errors.documents?.message} />
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
