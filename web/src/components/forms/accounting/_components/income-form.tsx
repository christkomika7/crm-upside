import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { incomeAccountingSchema, type IncomeAccountingSchemaType } from "@/lib/zod/accounting";
import { Textarea } from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type { AccountElement } from "@/types/accounting";
import { cn } from "@/lib/utils";
import RequiredLabel from "@/components/ui/required-label";
import { paymentMode as paymentModeData } from "@/lib/data";
import Modal from "@/components/modal/modal";
import AllocationModal from "@/components/modal/allocation";
import CategoryModal from "@/components/modal/category";
import NatureModal from "@/components/modal/nature";
import SourceModal from "@/components/modal/source";
import SecondNatureModal from "@/components/modal/second-nature";
import ThirdNatureModal from "@/components/modal/third-nature";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { SelectField } from "@/components/ui/select-field";

type ModalKey =
    | "allocation"
    | "source"
    | "category"
    | "nature"
    | "secondNature"
    | "thirdNature";

type Props = {
    accountingType: "INFLOW" | "OUTFLOW";
}

export default function IncomeForm({ accountingType }: Props) {
    const [openModal, setOpenModal] = useState<ModalKey | null>(null);

    const form = useForm<IncomeAccountingSchemaType>({
        resolver: zodResolver(incomeAccountingSchema),
        defaultValues: {
            date: new Date(),
            taxType: "HT",
            paymentMode: "CASH",
        }
    });

    const paymentMode = form.watch("paymentMode");
    const category = form.watch("category");
    const nature = form.watch("nature");
    const secondNature = form.watch("secondNature");

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
        queryKey: ["sources", paymentMode, accountingType],
        enabled: !!paymentMode,
        queryFn: () => apiFetch<AccountElement[]>(`/source?paymentMethod=${paymentMode}&accountingType=${accountingType}`),
        select: (data) => data.map((source) => ({
            value: source.id,
            label: source.name,
        })),
    });

    const { isPending: isGettingNature, data: natures } = useQuery({
        queryKey: ["natures", category, accountingType],
        enabled: !!category,
        queryFn: () => apiFetch<AccountElement[]>(`/nature?category=${category}&accountingType=${accountingType}`),
        select: (data) => data.map((nature) => ({
            value: nature.id,
            label: nature.name,
        })),
    });

    const { isPending: isGettingSecondNatures, data: secondNatures } = useQuery({
        queryKey: ["secondNatures", nature, accountingType],
        enabled: !!nature,
        queryFn: () => apiFetch<AccountElement[]>(`/second-nature?nature=${nature}&accountingType=${accountingType}`),
        select: (data) => data.map((nature) => ({
            value: nature.id,
            label: nature.name,
        })),
    });

    const { isPending: isGettingThirdNatures, data: thirdNatures } = useQuery({
        queryKey: ["thirdNatures", secondNature, accountingType],
        enabled: !!secondNature,
        queryFn: () => apiFetch<AccountElement[]>(`/third-nature?secondNature=${secondNature}&accountingType=${accountingType}`),
        select: (data) => data.map((nature) => ({
            value: nature.id,
            label: nature.name,
        })),
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            crudService.post<FormData, any>("/accounting/income/", data),
        onSuccess() {
            toast.success("Encaissement créé avec succès");
            queryClient.invalidateQueries({ queryKey: ["accountings"] });
            form.reset({
                date: new Date(),
                taxType: "HT",
                paymentMode: "CASH",
                amount: "",
                description: "",
                category: "",
                nature: "",
                secondNature: "",
                thirdNature: "",
                allocation: "",
                source: "",
                documents: [],
            });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const openModalHelper = (key: ModalKey) => setOpenModal(key);
    const closeModal = () => setOpenModal(null);


    async function submit(formData: IncomeAccountingSchemaType) {
        const { success, data } = incomeAccountingSchema.safeParse(formData);
        if (success) {
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
            mutation.mutate(formData);
        }
    }

    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <h2 className="font-medium">Informations d'entrée</h2>
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
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Catégorie"
                                    required
                                    placeholder="Sélectionner une catégorie"
                                    value={field.value ?? ""}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        form.setValue("secondNature", "");
                                        form.setValue("thirdNature", "");
                                    }}
                                    options={categories}
                                    isLoading={isGettingCategories}
                                    hasError={!!formState.errors.category}
                                    onAdd={() => openModalHelper("category")}
                                    emptyMessage="Aucune catégorie disponible"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nature"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Nature"
                                    required
                                    placeholder="Sélectionner la nature"
                                    value={field.value ?? ""}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        form.setValue("secondNature", "");
                                        form.setValue("thirdNature", "");
                                    }}
                                    options={natures}
                                    isLoading={isGettingNature}
                                    disabled={!category}
                                    hasError={!!formState.errors.nature}
                                    onAdd={() => openModalHelper("nature")}
                                    emptyMessage="Aucune nature disponible"
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="secondNature"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Seconde Nature"
                                    placeholder="Sélectionner la seconde nature"
                                    value={field.value ?? ""}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        form.setValue("thirdNature", "");
                                    }}
                                    options={secondNatures}
                                    isLoading={isGettingSecondNatures}
                                    disabled={!nature}
                                    hasError={!!formState.errors.secondNature}
                                    onAdd={() => openModalHelper("secondNature")}
                                    emptyMessage="Aucune seconde nature disponible"
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="thirdNature"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Troisième Nature"
                                    placeholder="Sélectionner la troisième nature"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    options={thirdNatures}
                                    isLoading={isGettingThirdNatures}
                                    disabled={!secondNature}
                                    hasError={!!formState.errors.thirdNature}
                                    onAdd={() => openModalHelper("thirdNature")}
                                    emptyMessage="Aucune troisième nature disponible"
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="allocation"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Allocation"
                                    placeholder="Sélectionner une allocation"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    options={allocations}
                                    isLoading={isGettingAllocations}
                                    hasError={!!formState.errors.allocation}
                                    onAdd={() => openModalHelper("allocation")}
                                    emptyMessage="Aucune allocation disponible"
                                />
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
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Mode de paiement"
                                    required
                                    placeholder="Sélectionner une valeur"
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        form.setValue("source", "");
                                    }}
                                    options={paymentModeData}
                                    hasError={!!formState.errors.paymentMode}
                                    emptyMessage="Aucun mode de paiement disponible"
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field, formState }) => (
                                <SelectField
                                    label="Source"
                                    required
                                    placeholder="Sélectionner une source"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    options={sources}
                                    isLoading={isGettingSources}
                                    hasError={!!formState.errors.source}
                                    onAdd={() => openModalHelper("source")}
                                    emptyMessage="Aucune source disponible"
                                />
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
                                "Enregistrer"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
            <Modal
                open={openModal === "allocation"}
                setOpen={(e) => !e && closeModal()}
                title="Gestion des allocations"
            >
                <AllocationModal accountingType={accountingType} />
            </Modal>
            <Modal
                open={openModal === "category"}
                setOpen={(e) => !e && closeModal()}
                title="Gestion des catégories"
            >
                <CategoryModal accountingType={accountingType} />
            </Modal>
            <Modal
                open={openModal === "source"}
                setOpen={(e) => !e && closeModal()}
                title="Gestion des sources"
            >
                <SourceModal paymentMode={paymentMode} accountingType={accountingType} />
            </Modal>
            <Modal
                open={openModal === "nature"}
                setOpen={(e) => !e && closeModal()}
                title="Gestion des natures"
            >
                <NatureModal categoryId={category} accountingType={accountingType} />
            </Modal>
            <Modal
                open={openModal === "secondNature"}
                setOpen={(e) => !e && closeModal()}
                title="Gestion des natures secondes"
            >
                <SecondNatureModal natureId={nature} accountingType={accountingType} />
            </Modal>
            <Modal
                open={openModal === "thirdNature"}
                setOpen={(e) => !e && closeModal()}
                title="Gestion des natures troisièmes"
            >
                <ThirdNatureModal
                    secondNatureId={secondNature ?? ""}
                    accountingType={accountingType}
                />
            </Modal>
        </div>
    )
}
