import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { Check, EditIcon, EyeIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  modules,
  moduleFr,
  actions,
  permissionsSchema,
  type PermissionsSchemaType,
  actionLabels,
} from "@/lib/zod/permissions";
import type { Permission } from "@/types/permissions";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";


type SetPermissionsProps = {
  id?: string;
  permission?: Permission;
  close?: () => void;
}

export default function SetPermissions({ id, permission, close }: SetPermissionsProps) {
  const defaultValues = Object.fromEntries(
    modules.map((module) => [
      module,
      permission?.[module] ?? [],
    ])
  );

  const form = useForm<PermissionsSchemaType>({
    resolver: zodResolver(permissionsSchema),
    defaultValues: {
      ...defaultValues
    }
  });

  const editPermission = useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: PermissionsSchemaType }) =>
      crudService.put(`/users/${userId}/permissions`, data),
    onSuccess() {
      toast.success("Permissions modifiées avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      close?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function currentState(state: "read" | "create" | "update") {
    switch (state) {
      case "read":
        return {
          color: "bg-emerald-500/10 text-emerald-500 ring-emerald-500",
          icon: <EyeIcon className="size-3.5 text-emerald-500" />
        }
      case "create":
        return {
          color: "bg-amber-400/10 text-amber-500 ring-amber-400",
          icon: <PlusIcon className="size-3.5 text-amber-400" />
        }
      case "update":
        return {
          color: "bg-red-500/10 text-red-500 ring-red-500",
          icon: <EditIcon className="size-3.5 text-red-500" />
        }
    }

  }

  async function submit(formData: PermissionsSchemaType) {
    const { success, data } = permissionsSchema.safeParse(formData);
    if (!success || !id) return;
    editPermission.mutate({ userId: id, data });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-4 w-full"
      >
        <div className="grid grid-cols-3 gap-2">
          {modules.map((module) => (
            <div
              key={module}
              className="flex gap-y-1 flex-col bg-neutral-50 py-2 px-4 rounded-md"
            >
              <span className="font-medium capitalize">
                {moduleFr[module]}
              </span>

              <FormField
                control={form.control}
                name={module}
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={"w-fit h-10! p-2! rounded-sm flex flex-start bg-white text-neutral-600 border-neutral-100 shadow-md shadow-neutral-400/10 hover:bg-neutral-50 justify-between"}
                        >
                          {

                            field.value.length > 0
                              ? field.value
                                .map((a) => <span className={cn("flex ring gap-x-1 text-xs items-center px-2 py-1 rounded-sm bg-emerald-500/10",
                                  currentState(a).color)
                                }> {currentState(a).icon} {actionLabels[a]}</span>)
                              : <span className="px-2">Sélectionner les permissions</span>}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-62.5 p-0">
                        <Command>
                          <CommandEmpty>
                            Aucune action
                          </CommandEmpty>

                          <CommandGroup>
                            {actions.map((action) => {
                              const isSelected =
                                field.value.includes(action);

                              return (
                                <CommandItem
                                  key={action}
                                  onSelect={() => {
                                    if (isSelected) {
                                      field.onChange(
                                        field.value.filter(
                                          (v) => v !== action
                                        )
                                      );
                                    } else {
                                      field.onChange([
                                        ...field.value,
                                        action,
                                      ]);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {actionLabels[action]}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          variant="action"
          className="max-w-40 h-10"
          disabled={editPermission.isPending}
        >
          {editPermission.isPending ? (
            <span className="flex justify-center items-center">
              <Spinner />
            </span>
          ) : (
            "Modifier"
          )}
        </Button>
      </form>
    </Form>
  );
}