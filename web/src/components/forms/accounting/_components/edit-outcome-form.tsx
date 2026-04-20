import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import {
  outcomeAccountingSchema,
  type OutcomeAccountingSchemaType,
} from "@/lib/zod/accounting";
import { Textarea } from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import type {
  AccountElement,
  OutcomeAccounting,
  OutcomeAccountingFile,
} from "@/types/accounting";
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
import type { Unit } from "@/types/unit";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { urlToFile } from "@/lib/upload";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import FormSkeleton from "@/components/skeleton/form-skeleton";


type ModalKey =
  | "allocation"
  | "source"
  | "category"
  | "nature"
  | "secondNature"
  | "thirdNature";


type Props = {
  accountingType: "INFLOW" | "OUTFLOW";
  id: string;
};

const DEFAULT_VALUES: OutcomeAccountingSchemaType = {
  date: new Date(),
  taxType: "HT",
  paymentMode: "CASH",
  category: "",
  nature: "",
  secondNature: "",
  thirdNature: "",
  source: "",
  allocation: "",
  unit: "",
  period: undefined,
  checkNumber: "",
  amount: "",
  description: "",
  documents: [],
};


export default function EditOutcomeForm({ accountingType, id }: Props) {
  const initialized = useRef({
    base: false,
    nature: false,
    secondNature: false,
    source: false
  });

  const [openModal, setOpenModal] = useState<ModalKey | null>(null);

  const openModalHelper = (key: ModalKey) => setOpenModal(key);
  const closeModal = () => setOpenModal(null);

  const form = useForm<OutcomeAccountingSchemaType>({
    resolver: zodResolver(outcomeAccountingSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { watch, setValue, reset, handleSubmit, formState } = form;

  const paymentMode = watch("paymentMode");
  const category = watch("category");
  const nature = watch("nature");
  const secondNature = watch("secondNature");

  const commonQueryOptions = {
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always" as const,
    refetchOnWindowFocus: true,
  };

  const { isPending: isLoading, data: outcome } = useQuery<OutcomeAccountingFile>({
    queryKey: ["accounting", id],
    enabled: !!id,
    queryFn: async () => {
      const data = await apiFetch<OutcomeAccounting>(`/accounting/${id}`);
      return {
        ...data,
        documents: data.documents?.length
          ? await Promise.all(data.documents.map((url) => urlToFile(url)))
          : [],
      };
    },
    ...commonQueryOptions,
  });

  const toOptions = (data: AccountElement[]): SelectOption[] =>
    data.map((el) => ({ value: el.id, label: el.name }));

  const { isPending: isGettingUnits, data: units } = useQuery({
    queryKey: ["units"],
    queryFn: () => apiFetch<Unit[]>("/unit/list"),
    select: (data) =>
      data.map((unit) => ({ value: unit.id, label: unit.reference })),
    ...commonQueryOptions,
  });

  const { isPending: isGettingCategories, data: categories } = useQuery({
    queryKey: ["categories", accountingType],
    queryFn: () =>
      apiFetch<AccountElement[]>(`/category?accountingType=${accountingType}`),
    select: toOptions,
    ...commonQueryOptions,
  });

  const { isPending: isGettingAllocations, data: allocations } = useQuery({
    queryKey: ["allocations", accountingType],
    queryFn: () =>
      apiFetch<AccountElement[]>(`/allocation?accountingType=${accountingType}`),
    select: toOptions,
    ...commonQueryOptions,
  });

  const { isPending: isGettingSources, data: sources } = useQuery({
    queryKey: ["sources", paymentMode, accountingType],
    enabled: !!paymentMode,
    queryFn: () =>
      apiFetch<AccountElement[]>(
        `/source?paymentMethod=${paymentMode}&accountingType=${accountingType}`
      ),
    select: toOptions,
    ...commonQueryOptions,
  });

  const { isPending: isGettingNature, data: natures } = useQuery({
    queryKey: ["natures", category, accountingType],
    enabled: !!category,
    queryFn: () =>
      apiFetch<AccountElement[]>(
        `/nature?category=${category}&accountingType=${accountingType}`
      ),
    select: toOptions,
    ...commonQueryOptions,
  });

  const { isPending: isGettingSecondNatures, data: secondNatures } = useQuery({
    queryKey: ["secondNatures", nature, accountingType],
    enabled: !!nature,
    queryFn: () =>
      apiFetch<AccountElement[]>(
        `/second-nature?nature=${nature}&accountingType=${accountingType}`
      ),
    select: toOptions,
    ...commonQueryOptions,
  });

  const { isPending: isGettingThirdNatures, data: thirdNatures } = useQuery({
    queryKey: ["thirdNatures", secondNature, accountingType],
    enabled: !!secondNature,
    queryFn: () =>
      apiFetch<AccountElement[]>(
        `/third-nature?secondNature=${secondNature}&accountingType=${accountingType}`
      ),
    select: toOptions,
    ...commonQueryOptions,
  });


  const mutation = useMutation({
    mutationFn: ({ incomeId, data }: { data: FormData; incomeId: string }) =>
      crudService.put<FormData, unknown>(`/accounting/outcome/${incomeId}`, data),
    onSuccess() {
      toast.success("Sortie modifiée avec succès");
      queryClient.invalidateQueries({ queryKey: ["accountings"] });
    },
    onError: (error: Error) => {
      console.error("Erreur:", error.message);
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!outcome || !categories || !allocations || !sources) return;
    if (initialized.current.base) return;

    initialized.current.base = true;

    reset({
      date: new Date(outcome.date),
      allocation: outcome.allocationId ?? "",
      category: outcome.categoryId ?? "",
      taxType: outcome.isTTC ? "TTC" : "HT",
      checkNumber: outcome.checkNumber ?? "",
      unit: outcome.unitId ?? "",
      period: outcome.period ? new Date(outcome.period) : undefined,
      paymentMode: outcome.paymentMode,
      amount: outcome.amount,
      description: outcome.description,
      documents: outcome.documents,
      source: "",
      nature: "",
      secondNature: "",
      thirdNature: "",
    });
  }, [outcome, categories, allocations, sources, reset]);

  useEffect(() => {
    if (!outcome || !sources) return;
    if (initialized.current.source) return;
    initialized.current.source = true;
    setValue("source", outcome.sourceId ?? "");
  }, [outcome, sources, setValue]);

  useEffect(() => {
    if (!outcome || !natures) return;
    if (initialized.current.nature) return;
    initialized.current.nature = true;
    setValue("nature", outcome.natureId ?? "");
  }, [outcome, natures, setValue]);

  useEffect(() => {
    if (!outcome || !secondNatures) return;
    if (initialized.current.secondNature) return;
    initialized.current.secondNature = true;
    setValue("secondNature", outcome.secondNatureId ?? "");
  }, [outcome, secondNatures, setValue]);

  useEffect(() => {
    if (!outcome || !thirdNatures) return;
    setValue("thirdNature", outcome.thirdNatureId ?? "");
  }, [outcome, thirdNatures, setValue]);

  useEffect(() => {
    initialized.current = { base: false, nature: false, secondNature: false, source: false };
  }, [id]);

  function submit(data: OutcomeAccountingSchemaType) {
    if (!id) return;

    const formData = new FormData();
    formData.append("date", data.date.toISOString());
    formData.append("taxType", data.taxType);
    formData.append("paymentMode", data.paymentMode);
    if (data.unit) formData.append("unit", data.unit);
    formData.append("amount", data.amount);
    if (data.checkNumber) formData.append("checkNumber", data.checkNumber);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("nature", data.nature);
    if (data.secondNature) formData.append("secondNature", data.secondNature);
    if (data.thirdNature) formData.append("thirdNature", data.thirdNature);
    if (data.allocation) formData.append("allocation", data.allocation);
    formData.append("source", data.source);
    if (data.period) formData.append("period", data.period.toISOString());
    data.documents?.forEach((file) => formData.append("documents", file));

    mutation.mutate({ data: formData, incomeId: id });
  }


  return (
    <div className="bg-white rounded-md space-y-4 p-4">
      <Activity mode={isLoading ? "visible" : "hidden"}>
        <FormSkeleton />
      </Activity>
      <Activity mode={isLoading ? "hidden" : "visible"}>
        <h2 className="font-medium">Modification de la sortie</h2>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(submit)}
            className="space-y-4.5 w-full"
          >
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-600">
                      Date
                      <RequiredLabel />
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        error={!!formState.errors.date}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <SelectField
                    label="Unité"
                    placeholder="Sélectionner une unité"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={units}
                    isLoading={isGettingUnits}
                    hasError={!!formState.errors.unit}
                    emptyMessage="Aucune unité disponible"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <SelectField
                    label="Catégorie"
                    required
                    placeholder="Sélectionner une catégorie"
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("nature", "");
                      setValue("secondNature", "");
                      setValue("thirdNature", "");
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
                render={({ field }) => (
                  <SelectField
                    label="Nature"
                    required
                    placeholder="Sélectionner la nature"
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("secondNature", "");
                      setValue("thirdNature", "");
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
                render={({ field }) => (
                  <SelectField
                    label="Seconde Nature"
                    placeholder="Sélectionner la seconde nature"
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("thirdNature", "");
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
                render={({ field }) => (
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
                render={({ field }) => (
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
                      <FormLabel className="text-neutral-600">
                        Montant
                        <RequiredLabel />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Entrer le montant"
                          value={field.value}
                          aria-invalid={!!formState.errors.amount}
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
                    <FormItem>
                      <FormLabel className="text-neutral-600 h-3.5">
                      </FormLabel>
                      <FormControl>
                        <div className="flex rounded-md border h-10! border-neutral-200 bg-neutral-50 p-0.5 gap-0.5 w-20">
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
                                  "flex-1 h-8.5 rounded-md text-sm font-medium transition-all duration-150",
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
                  <SelectField
                    label="Mode de paiement"
                    required
                    placeholder="Sélectionner une valeur"
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue("source", "");
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
                render={({ field }) => (
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

              <FormField
                control={form.control}
                name="checkNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-600">
                      Numéro de chèque
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Entrer le numéro de chèque"
                        value={field.value}
                        aria-invalid={!!formState.errors.checkNumber}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-600">Période</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        error={!!formState.errors.period}
                      />
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
                <FormItem>
                  <FormLabel className="text-neutral-600">
                    Description
                    <RequiredLabel />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrer la description"
                      value={field.value}
                      aria-invalid={!!formState.errors.description}
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
                <FormItem>
                  <FormControl>
                    <InputFile
                      value={field.value}
                      title="Ajouter des documents"
                      onChange={field.onChange}
                      error={formState.errors.documents?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                disabled={mutation.isPending}
                type="submit"
                variant="action"
                className="max-w-xl h-11"
              >
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
      </Activity>
    </div>
  );
}