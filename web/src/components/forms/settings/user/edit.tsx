import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userEditSchema, type UserEditSchemaType } from "@/lib/zod/user";
import { Input } from "@/components/ui/input";
import { AvatarProfil } from "@/components/input/upload";
import { useMutation } from "@tanstack/react-query";
import { crudService } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { useState } from "react";

type EditUserProps = {
    id: string;
    firstname: string;
    lastname: string;
    image?: string;
    close: () => void;
}


export default function EditUser({ id, firstname, lastname, image, close }: EditUserProps) {
    const [preview, setPreview] = useState<string>(image || "");

    const form = useForm<UserEditSchemaType>({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            firstname,
            lastname,
        }
    });


    const editUser = useMutation({
        mutationFn: ({ userId, data }: { userId: string, data: FormData }) =>
            crudService.put(`/users/${userId}`, data),
        onSuccess() {
            toast.success("Utilisateur modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            close();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeProfil = useMutation({
        mutationFn: ({ userId }: { userId: string }) =>
            crudService.delete(`/users/${userId}/image`),
        onSuccess() {
            toast.success("Image supprimée avec succès");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });


    async function submit(formData: UserEditSchemaType) {
        const { success, data } = userEditSchema.safeParse(formData);

        if (success) {
            const form = new FormData();
            form.append("firstname", data.firstname);
            form.append("lastname", data.lastname);
            if (data.image) {
                form.append("image", data.image);
            }
            editUser.mutate({ userId: id, data: form });
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
                                <AvatarProfil
                                    onDefaultRemove={() => {
                                        removeProfil.mutate({ userId: id });
                                    }}
                                    defaultAvatar={preview}
                                    onFileChange={(e) => {
                                        if (e) {
                                            setPreview(e?.preview || "");
                                            field.onChange(e?.file);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-x-2.5">
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

                </div>
                <Button disabled={editUser.isPending || removeProfil.isPending} type="submit" variant="action" className="max-w-xl h-10!">
                    {editUser.isPending || removeProfil.isPending ? (
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
