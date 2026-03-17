import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { passwordSchema, type PasswordSchemaType } from "@/lib/zod/user";
import { Input } from "@/components/ui/input";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";

type EditUserPasswordProps = {
    id: string;
    close?: () => void;
}

export default function EditUserPassword({ id, close }: EditUserPasswordProps) {
    const [show, setShow] = useState({
        password: true,
        newPassword: true,
    })


    const form = useForm<PasswordSchemaType>({
        resolver: zodResolver(passwordSchema),
    });

    const editPassword = useMutation({
        mutationFn: ({ userId, data }: { userId: string, data: PasswordSchemaType }) =>
            crudService.put(`/users/${userId}/password`, data),
        onSuccess() {
            toast.success("Mot de passe modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            close?.();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    async function submit(formData: PasswordSchemaType) {
        const { success, data } = passwordSchema.safeParse(formData);
        if (success) {
            editPassword.mutate({ userId: id, data });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-2.5 w-full"
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem >
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={show.password ? "password" : "text"}
                                        placeholder="Mot de passe"
                                        className="pr-8"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.password}
                                        onChange={field.onChange}
                                    />
                                    <span onClick={() => setShow({ ...show, password: !show.password })} className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer ">{show.password ? <EyeClosedIcon className="size-4 text-neutral-600" /> : <EyeIcon className="size-4 text-neutral-600" />} </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem >
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={show.newPassword ? "password" : "text"}
                                        placeholder="Nouveau mot de passe"
                                        className="pr-8"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.newPassword}
                                        onChange={field.onChange}
                                    />
                                    <span onClick={() => setShow({ ...show, newPassword: !show.newPassword })} className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer ">{show.newPassword ? <EyeClosedIcon className="size-4 text-neutral-600" /> : <EyeIcon className="size-4 text-neutral-600" />} </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={editPassword.isPending} type="submit" variant="action" className="max-w-xl h-10!">
                    {editPassword.isPending ? (
                        <span className="flex justify-center items-center">
                            <Spinner />
                        </span>
                    ) : (
                        "Modifier"
                    )}
                </Button>
            </form>
        </Form>
    )
}
