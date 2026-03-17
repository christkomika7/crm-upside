import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { brochureFilterSchema, type BrochureFilterSchemaType } from "@/lib/zod/brochure-filter";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";



export default function FilterBrochure() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<BrochureFilterSchemaType>({
        resolver: zodResolver(brochureFilterSchema),
        defaultValues: {
            parking: false,
            furnished: false,
            wifi: false,
            vacant: false
        },
    });

    async function submit(formData: BrochureFilterSchemaType) {
        const { success, data } = brochureFilterSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-4.5 w-full pt-2"
            >
                <div className="grid grid-cols-1 gap-2">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} >
                                        <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.type}>
                                            <SelectValue placeholder="Selectionner un type" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" align="end">
                                            <SelectItem value="light">Type 1</SelectItem>
                                            <SelectItem value="dark">Type 3</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} >
                                        <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.location}>
                                            <SelectValue placeholder="Selectionner une location" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" align="end">
                                            <SelectItem value="light">Location 1</SelectItem>
                                            <SelectItem value="dark">Location 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rooms"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} >
                                        <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.rooms}>
                                            <SelectValue placeholder="Selectionner le nombre de chambre" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" align="end">
                                            <SelectItem value="light"> 1</SelectItem>
                                            <SelectItem value="dark"> 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-4">
                    <h2 className="text-neutral-700 font-medium">Équipement</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="parking"
                            render={({ field }) => (
                                <FormItem className="flex flex-row-reverse justify-end items-center">
                                    <FormLabel className="text-neutral-600 text-sm">Parking</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="furnished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row-reverse justify-end items-center">
                                    <FormLabel className="text-neutral-600 text-sm">Meublé</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="wifi"
                            render={({ field }) => (
                                <FormItem className="flex flex-row-reverse justify-end items-center">
                                    <FormLabel className="text-neutral-600 text-sm">Wi-Fi</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vacant"
                            render={({ field }) => (
                                <FormItem className="flex flex-row-reverse justify-end items-center">
                                    <FormLabel className="text-neutral-600 text-sm">Vacant</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>
                <Button variant="action">{isLoading ? <Spinner /> : "Appliquer le filtrer"}</Button>
            </form>
        </Form>

    )
}
