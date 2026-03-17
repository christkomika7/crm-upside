import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { userSchema, type UserSchemaType } from "@/lib/zod/user";
import { Input } from "@/components/ui/input";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { AvatarProfil } from "@/components/input/upload";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";


type CreateUserProps = {
    close: (open: boolean) => void;
}

export default function CreateUser({ close }: CreateUserProps) {
    const [preview, setPreview] = useState<string>("");
    const [show, setShow] = useState(true);

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            crudService.post<FormData, any>("/users/create", data),
        onSuccess() {
            toast.success("Utilisateur créé avec succès");
            setPreview("");
            form.reset({
                image: undefined,
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                role: "USER",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            close(false);
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    const form = useForm<UserSchemaType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            image: undefined,
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            role: "USER",
        }
    });

    async function submit(formData: UserSchemaType) {
        const { success, data } = userSchema.safeParse(formData);
        if (success) {
            const form = new FormData();

            form.append("firstname", data.firstname);
            form.append("lastname", data.lastname);
            form.append("email", data.email);
            form.append("password", data.password);
            form.append("role", data.role);

            if (data.image) {
                form.append("image", data.image);
            }

            mutation.mutate(form);

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
                    name="image"
                    render={({ field }) => (
                        <FormItem >
                            <FormControl>
                                <AvatarProfil defaultAvatar={preview} onFileChange={(e) => {
                                    setPreview(e?.preview || "");
                                    field.onChange(e?.file || null);
                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-x-2.5">
                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nom de l'utilisateur"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.lastname}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem >
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Prénom de l'utilisateur"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.firstname}
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
                    name="email"
                    render={({ field }) => (
                        <FormItem >
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Email de l'utilisateur"
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
                                        aria-invalid={!!form.formState.errors.email}
                                        onChange={field.onChange}
                                    />
                                    <span onClick={() => setShow(!show)} className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer ">{show ? <EyeClosedIcon className="size-4 text-neutral-600" /> : <EyeIcon className="size-4 text-neutral-600" />} </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="action" className="max-w-xl h-10!">
                    {mutation.isPending ? (
                        <span className="flex justify-center items-center">
                            <Spinner />
                        </span>
                    ) : (
                        "Enregistrer"
                    )}
                </Button>
            </form>
        </Form>
    )
}
