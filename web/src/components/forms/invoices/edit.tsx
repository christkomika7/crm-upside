import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { invoiceSchema, type InvoiceSchemaType } from "@/lib/zod/invoices";
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
import MultipleSelector from "@/components/ui/mullti-select";
import { Textarea } from "@/components/ui/textarea";

const categories = [
    {
        value: 'clothing',
        label: 'Clothing'
    },
    {
        value: 'footwear',
        label: 'Footwear'
    },
    {
        value: 'accessories',
        label: 'Accessories'
    },
    {
        value: 'jewelry',
        label: 'Jewelry',
        disable: true
    },
    {
        value: 'outerwear',
        label: 'Outerwear'
    },
    {
        value: 'fragrance',
        label: 'Fragrance'
    },
    {
        value: 'makeup',
        label: 'Makeup'
    },
    {
        value: 'skincare',
        label: 'Skincare'
    },
    {
        value: 'furniture',
        label: 'Furniture'
    },
    {
        value: 'lighting',
        label: 'Lighting'
    },
    {
        value: 'kitchenware',
        label: 'Kitchenware',
        disable: true
    },
    {
        value: 'computers',
        label: 'Computers'
    },
    {
        value: 'audio',
        label: 'Audio'
    },
    {
        value: 'wearables',
        label: 'Wearables'
    },
    {
        value: 'supplements',
        label: 'Supplements'
    },
    {
        value: 'sportswear',
        label: 'Sportswear'
    }
]

export default function EditInvoices() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<InvoiceSchemaType>({
        resolver: zodResolver(invoiceSchema)
    });

    async function submit(formData: InvoiceSchemaType) {
        const { success, data } = invoiceSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations sur la facture</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Numéro de facture</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Entrez le numéro de facture"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.invoiceNumber}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="client"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Référence</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value} >
                                        <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.client}>
                                            <SelectValue placeholder="Selectionner un client" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" align="end">
                                            <SelectItem value="light">Christ Komika</SelectItem>
                                            <SelectItem value="dark">Mark Moura</SelectItem>
                                            <SelectItem value="system">Lassie Moua</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="items"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Elements</FormLabel>
                                <FormControl>
                                    <MultipleSelector
                                        commandProps={{
                                            label: 'Selection des éléments'
                                        }}
                                        value={
                                            field.value?.map((item: string) => ({
                                                value: item,
                                                label: item,
                                            })) ?? []
                                        }
                                        onChange={(options) => {
                                            field.onChange(options.map((opt) => opt.value))
                                        }}
                                        defaultOptions={categories}
                                        placeholder='Selectionnez des elemnts'
                                        hideClearAllButton
                                        hidePlaceholderWhenSelected
                                        emptyIndicator={<p className='text-center text-sm'>Aucun élément sélectionné</p>}
                                        className='w-full'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Montant</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Entrer le montant"
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
                            name="vat"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">TVA</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le taux de TVA"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.vat}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Réduction</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le taux de réduction"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.discount}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="finalAmount"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Montant final</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le montant final"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.finalAmount}
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
                                        placeholder="Entrez la note"
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
