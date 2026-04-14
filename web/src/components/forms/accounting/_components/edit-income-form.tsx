import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker";
import { incomeAccountingSchema, type IncomeAccountingSchemaType } from "@/lib/zod/accounting";
import { Textarea } from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { AccountElement, IncomeAccounting, IncomeAccountingFile } from "@/types/accounting";
import { LayersPlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import RequiredLabel from "@/components/ui/required-label";
import { paymentMode } from "@/lib/data";
import Modal from "@/components/modal/modal";
import AllocationModal from "@/components/modal/allocation";
import CategoryModal from "@/components/modal/category";
import NatureModal from "@/components/modal/nature";
import SourceModal from "@/components/modal/source";
import SecondNatureModal from "@/components/modal/second-nature";
import ThirdNatureModal from "@/components/modal/third-nature";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { urlToFile } from "@/lib/upload";

type Props = {
    accountingType: "INFLOW" | "OUTFLOW";
    id: string
}

export default function EditIncomeForm({ accountingType, id }: Props) {
    const [element, setElement] = useState<{
        paymentMode: "CASH" | "BANK" | "CHECK";
        category: string;
        nature: string;
        secondNature: string;
        thirdNature: string;
    }>({
        paymentMode: "CASH",
        category: "",
        nature: "",
        secondNature: "",
        thirdNature: "",
    });

    const [open, setOpen] = useState({
        allocation: false,
        source: false,
        category: false,
        nature: false,
        secondNature: false,
        thirdNature: false,
    });

    const { isPending: isLoading, data: income } = useQuery<IncomeAccountingFile>({
        queryKey: ["accounting", id],
        queryFn: async () => {
            const data = await apiFetch<IncomeAccounting>(`/accounting/${id}`);
            return {
                ...data,
                documents: data.documents?.length
                    ? await Promise.all(data.documents.map((url) => urlToFile(url)))
                    : [],
            };
        },
    });

    const { isPending: isGettingCategories, data: categories } = useQuery({
        queryKey: ["categories", accountingType],
        queryFn: () => apiFetch<AccountElement[]>(`/category?accountingType=${accountingType}`),
        select: (data) => data.map((category) => ({
            value: category.id,
            label: category.name,
        })),
    });

    const { isPending: isGettingAllocations, data: allocations } = useQuery({
        queryKey: ["allocations", accountingType],
        queryFn: () => apiFetch<AccountElement[]>(`/allocation?accountingType=${accountingType}`),
        select: (data) => data.map((allocation) => ({
            value: allocation.id,
            label: allocation.name,
        })),
    });


    const { isPending: isGettingSources, data: sources } = useQuery({
        queryKey: ["sources", element.paymentMode, accountingType],
        queryFn: () => apiFetch<AccountElement[]>(`/source?paymentMethod=${element.paymentMode}&accountingType=${accountingType}`),
        select: (data) => data.map((source) => ({
            value: source.id,
            label: source.name,
        })),
    });

    const { isPending: isGettingNature, data: natures } = useQuery({
        queryKey: ["natures", element.category, accountingType],
        queryFn: () => apiFetch<AccountElement[]>(`/nature?category=${element.category}&accountingType=${accountingType}`),
        select: (data) => data.map((nature) => ({
            value: nature.id,
            label: nature.name,
        })),
    });

    const { isPending: isGettingSecondNatures, data: secondNatures } = useQuery({
        queryKey: ["secondNatures", element.nature, accountingType],
        queryFn: () => apiFetch<AccountElement[]>(`/second-nature?nature=${element.nature}&accountingType=${accountingType}`),
        select: (data) => data.map((nature) => ({
            value: nature.id,
            label: nature.name,
        })),
    });

    const { isPending: isGettingThirdNatures, data: thirdNatures } = useQuery({
        queryKey: ["thirdNatures", element.secondNature, accountingType],
        queryFn: () => apiFetch<AccountElement[]>(`/third-nature?secondNature=${element.secondNature}&accountingType=${accountingType}`),
        select: (data) => data.map((nature) => ({
            value: nature.id,
            label: nature.name,
        })),
    });

    const form = useForm<IncomeAccountingSchemaType>({
        resolver: zodResolver(incomeAccountingSchema),
        defaultValues: {
            date: new Date(),
            taxType: "HT",
            paymentMode: "CASH",
        }
    });


    const mutation = useMutation({
        mutationFn: ({ incomeId, data }: { data: FormData, incomeId: string }) =>
            crudService.put<FormData, any>(`/accounting/income/${incomeId}`, data),
        onSuccess() {
            toast.success("Encaissement modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["accountings"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });


    useEffect(() => {
        if (income) {
            form.reset({
                date: new Date(income.date),
                allocation: income.allocationId,
                category: income.categoryId,
                taxType: income.isTTC ? "TTC" : "HT",
                paymentMode: income.paymentMode,
                amount: income.amount,
                description: income.description,
                nature: income.natureId,
                secondNature: income.secondNatureId,
                thirdNature: income.thirdNatureId,
                source: income.sourceId,
                documents: income.documents,
            });
            setElement({
                paymentMode: income.paymentMode,
                category: income.categoryId,
                nature: income.natureId,
                secondNature: income.secondNatureId || "",
                thirdNature: income.thirdNatureId || "",
            });
        }
    }, [income])


    async function submit(formData: IncomeAccountingSchemaType) {
        const { success, data } = incomeAccountingSchema.safeParse(formData);
        if (success && id) {
            const formData = new FormData();
            formData.append("date", data.date.toISOString());
            formData.append("taxType", data.taxType);
            formData.append("paymentMode", data.paymentMode);
            formData.append("amount", data.amount);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("nature", data.nature);
            data.secondNature && formData.append("secondNature", data.secondNature);
            data.thirdNature && formData.append("thirdNature", data.thirdNature);
            data.allocation && formData.append("allocation", data.allocation);
            formData.append("source", data.source);
            if (data.documents) {
                data.documents.forEach((file) => {
                    formData.append("documents", file);
                });
            }
            mutation.mutate({ incomeId: id, data: formData });
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Modification de l'entrée</h2>
            <Activity mode={isLoading ? 'visible' : "hidden"}>
                <Spinner />
            </Activity>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="space-y-4.5 w-full"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Date<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.date} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Catégorie<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => {
                                                setElement({ ...element, category: e })
                                                field.onChange(e)
                                            }} value={field.value} >
                                                <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.category}>
                                                    <SelectValue placeholder="Selectionner une catégorie" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingCategories ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : categories && categories.length > 0 ? (
                                                        categories.map((category) => (
                                                            <SelectItem key={category.value} value={category.value}>
                                                                {category.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucune catégorie disponible
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => setOpen({ ...open, category: true })} type='button' variant="outline" className="h-10 shadow-none">
                                                <LayersPlusIcon />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nature"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Nature<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => {
                                                setElement({ ...element, nature: e })
                                                field.onChange(e)
                                            }} value={field.value} >
                                                <SelectTrigger disabled={!element.category} className="w-full" aria-invalid={!!form.formState.errors.nature}>
                                                    <SelectValue placeholder="Sélectionner la nature" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingNature ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : natures && natures.length > 0 ? (
                                                        natures.map((nature) => (
                                                            <SelectItem key={nature.value} value={nature.value}>
                                                                {nature.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucune nature disponible
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => setOpen({ ...open, nature: true })} type='button' variant="outline" className="h-10 shadow-none">
                                                <LayersPlusIcon />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="secondNature"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Seconde Nature</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => {
                                                setElement({ ...element, secondNature: e })
                                                field.onChange(e)
                                            }} value={field.value} >
                                                <SelectTrigger disabled={!element.nature} className="w-full" aria-invalid={!!form.formState.errors.secondNature}>
                                                    <SelectValue placeholder="Sélectionner la seconde nature" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingSecondNatures ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : secondNatures && secondNatures.length > 0 ? (
                                                        secondNatures.map((secondNature) => (
                                                            <SelectItem key={secondNature.value} value={secondNature.value}>
                                                                {secondNature.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucune seconde nature disponible
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => setOpen({ ...open, secondNature: true })} type='button' variant="outline" className="h-10 shadow-none">
                                                <LayersPlusIcon />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="thirdNature"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Troisième Nature</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                                <SelectTrigger disabled={!element.secondNature} className="w-full" aria-invalid={!!form.formState.errors.thirdNature}>
                                                    <SelectValue placeholder="Sélectionner la troisième nature" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingThirdNatures ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : thirdNatures && thirdNatures.length > 0 ? (
                                                        thirdNatures.map((thirdNature) => (
                                                            <SelectItem key={thirdNature.value} value={thirdNature.value}>
                                                                {thirdNature.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucune troisième nature disponible
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => setOpen({ ...open, thirdNature: true })} type='button' variant="outline" className="h-10 shadow-none">
                                                <LayersPlusIcon />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="allocation"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Allocation</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={e => field.onChange(e)} value={field.value} >
                                                <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.allocation}>
                                                    <SelectValue placeholder="Sélectionner une allocation" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingAllocations ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : allocations && allocations.length > 0 ? (
                                                        allocations.map((allocation) => (
                                                            <SelectItem key={allocation.value} value={allocation.value}>
                                                                {allocation.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucune allocation disponible
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => setOpen({ ...open, allocation: true })} type='button' variant="outline" className="h-10 shadow-none">
                                                <LayersPlusIcon />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-1">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-neutral-600">Montant<RequiredLabel /></FormLabel>
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
                                name="taxType"
                                render={({ field }) => (
                                    <FormItem className="flex justify-end">
                                        <FormControl>
                                            <div className="flex rounded-md border border-neutral-200 bg-neutral-50 p-0.5 gap-0.5 w-20">
                                                {(
                                                    [
                                                        { value: "HT", label: "HT" },
                                                        { value: "TTC", label: "TTC" },
                                                    ] as const
                                                ).map(({ value, label }) => {
                                                    const isActive = field.value === value;
                                                    return (
                                                        <button
                                                            key={value}
                                                            type="button"
                                                            onClick={() => field.onChange(value)}
                                                            className={cn(
                                                                "flex-1 h-8 rounded-md text-sm font-medium transition-all duration-150",
                                                                isActive
                                                                    ? "bg-white text-emerald-600 border border-emerald-200 shadow-sm"
                                                                    : "text-neutral-400 hover:text-neutral-600"
                                                            )}
                                                        >
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="paymentMode"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Mode de paiement<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <Select onValueChange={e => {
                                            field.onChange(e);
                                            setElement(prev => ({
                                                ...prev,
                                                paymentMode: e as "CASH" | "BANK" | "CHECK",
                                            }));
                                        }} value={field.value} >
                                            <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.paymentMode}>
                                                <SelectValue placeholder="Selectionner une valeur" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" align="end">
                                                {paymentMode.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-neutral-600">Source<RequiredLabel /></FormLabel>
                                    <FormControl>
                                        <div className="flex gap-x-2">
                                            <Select onValueChange={field.onChange} value={field.value} >
                                                <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.source}>
                                                    <SelectValue placeholder="Selectionner une source" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" align="end">
                                                    {isGettingSources ? (
                                                        <div className="flex justify-center items-center">
                                                            <Spinner />
                                                        </div>
                                                    ) : sources && sources.length > 0 ? (
                                                        sources.map((source) => (
                                                            <SelectItem key={source.value} value={source.value}>
                                                                {source.label}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Aucune source disponible
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => setOpen({ ...open, source: true })} type='button' variant="outline" className="h-10 shadow-none">
                                                <LayersPlusIcon />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel className="text-neutral-600">Description<RequiredLabel /></FormLabel>
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
                    <FormField
                        control={form.control}
                        name="documents"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <InputFile value={field.value} title="Ajouter des documents" onChange={field.onChange} error={form.formState.errors.documents?.message} />
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
                                "Modifier"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
            <Modal open={open.allocation} setOpen={(e) => setOpen({ ...open, allocation: e })} title='Gestion des allocations'>
                <AllocationModal accountingType={accountingType} />
            </Modal>
            <Modal open={open.category} setOpen={(e) => setOpen({ ...open, category: e })} title='Gestion des catégories'>
                <CategoryModal accountingType={accountingType} />
            </Modal>
            <Modal open={open.source} setOpen={(e) => setOpen({ ...open, source: e })} title='Gestion des sources'>
                <SourceModal paymentMode={element.paymentMode} accountingType={accountingType} />
            </Modal>
            <Modal open={open.nature} setOpen={(e) => setOpen({ ...open, nature: e })} title='Gestion des natures'>
                <NatureModal categoryId={element.category} accountingType={accountingType} />
            </Modal>
            <Modal open={open.secondNature} setOpen={(e) => setOpen({ ...open, secondNature: e })} title='Gestion des natures secondes'>
                <SecondNatureModal natureId={element.nature} accountingType={accountingType} />
            </Modal>
            <Modal open={open.thirdNature} setOpen={(e) => setOpen({ ...open, thirdNature: e })} title='Gestion des natures troisièmes'>
                <ThirdNatureModal secondNatureId={element.secondNature} accountingType={accountingType} />
            </Modal>
        </div>
    )
}
