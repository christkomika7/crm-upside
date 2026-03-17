import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { serviceProvidersSchema, type ServiceProvidersSchemaType } from "@/lib/zod/service-providers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputFile from "@/components/ui/input-file";
import { FileUpIcon, ImageIcon, StarIcon } from "lucide-react";
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group"
import { cn } from "@/lib/utils";


export default function CreateServiceProvider() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ServiceProvidersSchemaType>({
        resolver: zodResolver(serviceProvidersSchema),
    });

    async function submit(formData: ServiceProvidersSchemaType) {
        const { success, data } = serviceProvidersSchema.safeParse(formData);
        if (success) {
            setIsLoading(true);
            console.log({ data });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations du prestataire</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Prénom</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le prénom du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.firstname}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nom de famille</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom de famille du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.lastname}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Entreprise</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le nom de l'entreprise"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.company}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Profession</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.profession}>
                                                <SelectValue placeholder="Selectionner une profession" />
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
                            name="address"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Adresse</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'adresse du prestataire"
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
                            name="companyContact"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Contact de l'entreprise</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le contact de l'entreprise"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.companyContact}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Téléphone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le téléphone du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.phone}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer l'email du prestataire"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.email}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="taxId"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Numéro d'identification fiscale (NIF)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le numéro d'identification fiscale"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.taxId}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="registerNumber"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Numéro d'enregistrement</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrer le numéro d'enregistrement"
                                            value={field.value}
                                            aria-invalid={!!form.formState.errors.registerNumber}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentTerms"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Conditions de paiement</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.paymentTerms}>
                                                <SelectValue placeholder="Selectionner les conditions de paiement" />
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
                            name="rating"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Note de qualité</FormLabel>
                                    <FormControl>
                                        <ButtonGroup className="w-full">
                                            <div className="flex items-center px-3 gap-1 border-input border rounded-md border-r-0">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => field.onChange({ ...field.value, note: star })}
                                                        onMouseMove={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const x = e.clientX - rect.left;
                                                            const isHalf = x < rect.width / 2;
                                                            field.onChange({ ...field.value, note: star - (isHalf ? 0.5 : 0) });
                                                        }}
                                                        className="cursor-pointer transition-colors"
                                                    >
                                                        <StarIcon
                                                            size={20}
                                                            className={
                                                                cn("transition-colors size-4",
                                                                    (field.value?.note || 0) >= star
                                                                        ? "fill-amber-500 text-amber-500"
                                                                        : (field.value?.note || 0) >= star - 0.5
                                                                            ? "fill-amber-500 text-amber-500"
                                                                            : "text-gray-300"
                                                                )
                                                            }
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <ButtonGroupSeparator />
                                            <Input
                                                className="w-full"
                                                placeholder="Entrer un commentaire"
                                                value={field.value?.comment || ""}
                                                aria-invalid={!!form.formState.errors.rating?.comment}
                                                onChange={(e) => field.onChange({ ...field.value, comment: e.target.value })}
                                            />
                                        </ButtonGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="rccDocument"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile multiple={false} value={field.value} onChange={field.onChange} error={form.formState.errors.rccDocument?.message}
                                            icon={
                                                <div className="flex items-center bg-blue-600/5 justify-center rounded-full  p-2.5">
                                                    <ImageIcon className="size-6 text-blue-600" />
                                                </div>
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="idCardDocument"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile value={field.value} onChange={field.onChange} error={form.formState.errors.idCardDocument?.message}
                                            icon={
                                                <div className="flex items-center bg-emerald-600/5 justify-center rounded-full  p-2.5">
                                                    <FileUpIcon className="size-6 text-emerald-600" />
                                                </div>
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taxCertificateDocument"
                            render={({ field }) => (
                                <FormItem >
                                    <FormControl>
                                        <InputFile value={field.value} onChange={field.onChange} error={form.formState.errors.taxCertificateDocument?.message}
                                            icon={
                                                <div className="flex items-center bg-amber-600/5 justify-center rounded-full  p-2.5">
                                                    <FileUpIcon className="size-6 text-amber-400" />
                                                </div>
                                            }
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
