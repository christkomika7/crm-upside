import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { productServiceSchema, type ProductServiceSchemaType } from "@/lib/zod/product-service";
import { Input } from "@/components/ui/input";


export default function CreateProductService() {
    const mutation = useMutation({
        mutationFn: (data: ProductServiceSchemaType) =>
            crudService.post<ProductServiceSchemaType, any>("/product-service/", data),
        onSuccess() {
            toast.success("Produit ou service créé avec succès");
            queryClient.invalidateQueries({ queryKey: ["product-services"] });
            form.reset({
                reference: "",
                description: "",
                price: "",
                hasTax: false,
            });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const form = useForm<ProductServiceSchemaType>({
        resolver: zodResolver(productServiceSchema),
        defaultValues: {
            reference: "",
            description: "",
            price: "",
            hasTax: false,
        }
    });

    async function submit(formData: ProductServiceSchemaType) {
        const { success, data } = productServiceSchema.safeParse(formData);
        if (success) {
            mutation.mutate(data)
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations du produit ou service</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Reference</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer la reference"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.reference}
                                            onChange={field.onChange}
                                        />
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
                        <div className="flex flex-col">
                            <Label className="text-neutral-600 mb-0.5 relative -top-0.5 text-sm font-medium p-0">Taxe</Label>
                            <FormField
                                control={form.control}
                                name="hasTax"
                                render={({ field }) => (
                                    <FormItem className={cn("flex flex-row gap-x-2 justify-between items-center px-3 h-10 border-border border rounded-md", {
                                        "bg-emerald-50 border-emerald-background ring-emerald-background/50 ring-[3px]": field.value
                                    })} >
                                        <FormLabel className="text-neutral-600 w-full h-full">Appliquer une taxe</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Entrer la description"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.description}
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
        </div >
    )
}
