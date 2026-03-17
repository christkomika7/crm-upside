import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { emailSchema, type EmailSchemaType } from "@/lib/zod/user";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { useState } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";


type EditUserEmailProps = {
    id: string;
    email: string;
    close?: () => void;
}

export default function EditUserEmail({ id, email, close }: EditUserEmailProps) {
    const [show, setShow] = useState(true)
    const form = useForm<EmailSchemaType>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email,
        }
    });

    const editEmail = useMutation({
        mutationFn: ({ userId, data }: { userId: string, data: EmailSchemaType }) =>
            crudService.put(`/users/${userId}/email`, data),
        onSuccess() {
            toast.success("Email modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            close?.();
        },
        onError: (error: Error) => {
            console.log({ error })
            toast.error(error.message);
        },
    });

    async function submit(formData: EmailSchemaType) {
        const { success, data } = emailSchema.safeParse(formData);
        if (success) {
            editEmail.mutate({ userId: id, data });
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
                    name="email"
                    render={({ field }) => (
                        <FormItem >
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Nouvel adresse mail"
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
                    name="password"
                    render={({ field }) => (
                        <FormItem >
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={show ? "password" : "text"}
                                        placeholder="Mot de passe"
                                        className="pr-8"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.password}
                                        onChange={field.onChange}
                                    />
                                    <span onClick={() => setShow(!show)} className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer ">{show ? <EyeClosedIcon className="size-4 text-neutral-600" /> : <EyeIcon className="size-4 text-neutral-600" />} </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={editEmail.isPending} type="submit" variant="action" className="max-w-xl h-10!">
                    {editEmail.isPending ? (
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
