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
import type { Building } from "@/types/building";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import RequiredLabel from "@/components/ui/required-label";


export default function MandateForm() {
  const [reference, setReference] = useState<string>("");

  const { isPending: isGettingBuildings, data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => apiFetch<Building[]>("/building"),
    select: (data) =>
      data.map((building) => ({
        value: building.id,
        label: `${building.name}`,
      })),
  });


  const { isPending: isGettingDisabledDates, data: disabledDates } = useQuery({
    queryKey: ["contract", reference],
    enabled: !!reference,
    queryFn: () => apiFetch<[Date, Date][]>(`/contract/disabled?type=MANDATE&reference=${reference}`),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: (data: MandateSchemaType) =>
      crudService.post<MandateSchemaType, any>("/contract", data),
    onSuccess() {
      toast.success("Mandat créé avec succès.");
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

  async function submit(formData: MandateSchemaType) {
    const { success, data } = mandateSchema.safeParse(formData);
    if (success) {
      mutation.mutate(data);
    }
  }

  return (
    <div className="bg-white rounded-md space-y-4 p-4">
      <h2 className="font-medium">Informations sur le mandat</h2>
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
                  <FormLabel className="text-neutral-600">Bâtiment<RequiredLabel /></FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => {
                      field.onChange(value)
                      setReference(value)
                    }
                    } value={field.value} >
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
                            Aucune bâtiment disponible
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
                  <FormLabel className="text-neutral-600">Période<RequiredLabel /> </FormLabel>
                  <FormControl>
                    <DatePicker
                      type="range"
                      date={field.value}
                      setDate={field.onChange}
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
    </div>
  )
}
