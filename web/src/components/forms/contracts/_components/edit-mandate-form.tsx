import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mandateSchema, type MandateSchemaType } from "@/lib/zod/contract";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Activity, useEffect, useState } from "react";
import type { Contract } from "@/types/contract";
import type { Building } from "@/types/building";
import { DatePicker } from "@/components/ui/date-picker";
import { isSameRangeDate } from "@/lib/utils";

type EditMandateFormProps = {
  id: string
}

export default function EditMandateForm({ id }: EditMandateFormProps) {
  const [reference, setReference] = useState<string>("");
  const [disabledDates, setDisabledDates] = useState<[Date, Date][]>([]);
  const [current, setCurrent] = useState<[Date, Date]>();
  const [isAlreadyExist, setIsAlreadyExist] = useState(true);

  const { isPending: isGettingContract, data: contract } = useQuery({
    queryKey: ["contract", id],
    enabled: !!id,
    queryFn: () => apiFetch<Contract>(`/contract/${id}`),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const { isPending: isGettingDisabledDates } = useQuery({
    queryKey: ["contract", reference, id],
    enabled: !!reference && !!id,
    queryFn: async () => {
      const result = await apiFetch<[Date, Date][]>(`/contract/disabled/${id}?type=MANDATE&reference=${reference}`);
      setDisabledDates(result)
      return result
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });


  const { isPending: isGettingBuildings, data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => apiFetch<Building[]>("/building"),
    select: (data) =>
      data.map((building) => ({
        value: building.id,
        label: `${building.reference}`,
      })),
  });


  const mutation = useMutation({
    mutationFn: ({ contractId, data }: { data: MandateSchemaType, contractId: string }) =>
      crudService.put<MandateSchemaType, any>(`/contract/${contractId}`, data),
    onSuccess() {
      toast.success("Mandat modifié avec succès.");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      form.reset({
        building: "",
        type: "MANDATE",
        period: undefined,
      });
    },
    onError: (error: Error) => {
      console.error("Erreur:", error.message);
      toast.error(error.message);
    },
  });


  const form = useForm<MandateSchemaType>({
    resolver: zodResolver(mandateSchema),
    defaultValues: {
      building: "",
      type: "MANDATE",
      period: undefined,
    }
  });

  useEffect(() => {
    if (contract) {
      setReference(contract?.buildingId || "");
      setDisabledDates(contract?.disabled || [])
      form.reset({
        building: contract.buildingId,
        type: contract.type,
        period: {
          from: new Date(contract.start),
          to: new Date(contract.end)
        }
      })
    }
  }, [contract])

  async function submit(formData: MandateSchemaType) {
    const { success, data } = mandateSchema.safeParse(formData);
    if (success && contract?.id) {
      mutation.mutate({
        contractId: contract.id, data: {
          ...data,
          period: {
            from: new Date(data.period.from),
            to: new Date(data.period.to),
          }
        }
      });
    }
  }

  return (
    <div className="bg-white rounded-md space-y-4 p-4">
      <h2 className="font-medium">Modification du contrat</h2>
      <Activity mode={isGettingContract ? 'visible' : "hidden"}>
        <Spinner />
      </Activity>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4.5 w-full"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="building"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Bâtiment</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setReference(value)
                      }}
                      value={field.value} >
                      <SelectTrigger className="w-full h-11!" aria-invalid={!!form.formState.errors.building}>
                        <SelectValue placeholder="Selectionner un bâtiment" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="end">
                        {isGettingBuildings ? (
                          <div className="flex justify-center items-center">
                            <Spinner />
                          </div>
                        ) : buildings && buildings.length > 0 ? (
                          buildings.map((building) => (
                            <SelectItem key={building.value} value={building.value}>
                              {building.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            Aucun bâtiment disponible
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
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
                      type="range"
                      date={field.value}
                      setDate={(e) => {
                        field.onChange(e);
                        if (e?.from && e.to && current) {
                          setIsAlreadyExist(isSameRangeDate(current, [e.from, e.to]))
                        }
                      }}
                      error={!!form.formState.errors.period}
                      hasIcon
                      disabled={isGettingDisabledDates || !reference}
                      disabledRanges={disabledDates}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <div className="flex justify-center">
            <Button disabled={mutation.isPending || isAlreadyExist} type="submit" variant="action" className="max-w-xl h-11">
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
    </div>
  )
}
