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
import { DatePicker } from "@/components/ui/date-picker";
import { accountingSchema, type AccountingSchemaType } from "@/lib/zod/accounting";
import { Textarea } from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";


export default function EditOutcomeForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AccountingSchemaType>({
    resolver: zodResolver(accountingSchema),
    defaultValues: {
      date: new Date(),
    }
  });

  async function submit(formData: AccountingSchemaType) {
    const { success, data } = accountingSchema.safeParse(formData);
    if (success) {
      setIsLoading(true);
      console.log({ data });
    }
  }

  return (
    <div className="bg-white rounded-md space-y-4 p-4">
      <h2 className="font-medium">Informations de sortie</h2>
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
                  <FormLabel className="text-neutral-600">Date</FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} error={!!form.formState.errors.date} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.type}>
                        <SelectValue placeholder="Selectionner un type" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="end">
                        <SelectItem value="dark">Type 1</SelectItem>
                        <SelectItem value="light">Type 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidFor"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Payé pour</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.paidFor}>
                        <SelectValue placeholder="Selectionner un client" />
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
              name="allocation"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Allocation</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.allocation}>
                        <SelectValue placeholder="Selectionner une allocation" />
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
              name="category"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Catégorie</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.category}>
                        <SelectValue placeholder="Selectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="end">
                        <SelectItem value="dark">Categorie 1</SelectItem>
                        <SelectItem value="light">Categorie 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstNature"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Nature</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.firstNature}>
                        <SelectValue placeholder="Selectionner une nature" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="end">
                        <SelectItem value="dark">Nature 1</SelectItem>
                        <SelectItem value="light">Nature 2</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.secondNature}>
                        <SelectValue placeholder="Selectionner une nature" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="end">
                        <SelectItem value="dark">Nature 1</SelectItem>
                        <SelectItem value="light">Nature 2</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.thirdNature}>
                        <SelectValue placeholder="Selectionner une nature" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="end">
                        <SelectItem value="dark">Nature 1</SelectItem>
                        <SelectItem value="light">Nature 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Montant</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="number"
                        placeholder="Entrer le montant"
                        value={field.value}
                        aria-invalid={!!form.formState.errors.amount}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Tax</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Entrer le montant de la taxe"
                      value={field.value}
                      aria-invalid={!!form.formState.errors.tax}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Méthode de paiement</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full" aria-invalid={!!form.formState.errors.method}>
                        <SelectValue placeholder="Selectionner une méthode de paiement" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="end">
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="check">Chèque</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkNumber"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Numéro de chèque</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Entrer le numéro de chèque"
                      value={field.value}
                      aria-invalid={!!form.formState.errors.checkNumber}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="text-neutral-600">Référence</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Entrer la référence"
                      value={field.value}
                      aria-invalid={!!form.formState.errors.reference}
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
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem >
                <FormLabel className="text-neutral-600">Commentaire</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Entrer le commentaire"
                    value={field.value}
                    aria-invalid={!!form.formState.errors.comment}
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
                "Modifier"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
