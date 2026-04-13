import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { EyeIcon, PlusIcon, EditIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  modules,
  moduleFr,
  actions,
  permissionsSchema,
  type PermissionsSchemaType,
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
};

const actionConfig = {
  read: {
    label: "Lire",
    activeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20",
    inactiveClass: "bg-neutral-50 text-neutral-400 border-neutral-100 hover:bg-neutral-100 hover:text-neutral-500",
    icon: <EyeIcon className="size-3.5" />,
  },
  create: {
    label: "Créer",
    activeClass: "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20",
    inactiveClass: "bg-neutral-50 text-neutral-400 border-neutral-100 hover:bg-neutral-100 hover:text-neutral-500",
    icon: <PlusIcon className="size-3.5" />,
  },
  update: {
    label: "Modifier",
    activeClass: "bg-amber-500/10 text-amber-500 border-amber-200 hover:bg-amber-500/20",
    inactiveClass: "bg-neutral-50 text-neutral-400 border-neutral-100 hover:bg-neutral-100 hover:text-neutral-500",
    icon: <EditIcon className="size-3.5" />,
  },
} as const;

export default function SetPermissions({ id, permission, close }: SetPermissionsProps) {
  const defaultValues = Object.fromEntries(
    modules.map((module) => [module, permission?.[module] ?? []])
  );

  const form = useForm<PermissionsSchemaType>({
    resolver: zodResolver(permissionsSchema),
    defaultValues: { ...defaultValues },
  });

  const editPermission = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: PermissionsSchemaType }) =>
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

  async function submit(formData: PermissionsSchemaType) {
    const { success, data } = permissionsSchema.safeParse(formData);
    if (!success || !id) return;
    editPermission.mutate({ userId: id, data });
  }

  const watchedValues = form.watch();
  const totalPerms = modules.reduce((acc, mod) => acc + (watchedValues[mod]?.length ?? 0), 0);
  const activeModules = modules.filter((mod) => (watchedValues[mod]?.length ?? 0) > 0).length;

  return (
    <div className="space-y-2">
      <p className="text-xs text-neutral-400">
        <span className="text-neutral-600 font-medium">{activeModules}</span> module{activeModules !== 1 ? "s" : ""} actif{activeModules !== 1 ? "s" : ""}{" "}
        ·{" "}
        <span className="text-neutral-600 font-medium">{totalPerms}</span> permission{totalPerms !== 1 ? "s" : ""}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4 w-full">
          <div className="grid grid-cols-3 gap-2">
            {modules.map((module) => (
              <FormField
                key={module}
                control={form.control}
                name={module}
                render={({ field }) => {
                  const hasPerms = field.value.length > 0;
                  return (
                    <FormItem>
                      <div
                        className={cn(
                          "flex flex-col gap-2 py-3 px-3.5 rounded-xl border transition-colors duration-150",
                          hasPerms
                            ? "bg-white border-neutral-100"
                            : "bg-neutral-50/30 border-neutral-100"
                        )}
                      >
                        <span className="text-xs font-medium text-neutral-500 truncate">
                          {moduleFr[module]}
                        </span>

                        <div className="flex flex-wrap gap-1.5">
                          {actions.map((action) => {
                            const isSelected = field.value.includes(action);
                            const config = actionConfig[action];

                            return (
                              <button
                                key={action}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    field.onChange(field.value.filter((v) => v !== action));
                                  } else {
                                    field.onChange([...field.value, action]);
                                  }
                                }}
                                className={cn(
                                  "inline-flex items-center gap-1 text-[11px] font-medium px-3 py-1 rounded-full border transition-all duration-150 cursor-pointer",
                                  isSelected ? config.activeClass : config.inactiveClass
                                )}
                              >
                                {config.icon}
                                {config.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="action"
              className="h-9 px-5 w-sm"
              disabled={editPermission.isPending}
            >
              {editPermission.isPending ? (
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
  );
}