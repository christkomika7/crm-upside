"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { loginSchema, type LoginSchema } from "@/lib/zod/login";
import { Label } from "../ui/label";
import { MailIcon, LockKeyholeIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function submit(formData: LoginSchema) {
        const { success, data } = loginSchema.safeParse(formData);
        if (success) {
            const { email, password } = data;
            setLoading(true);

            const res = await authClient.signIn.email({
                email,
                password,
                rememberMe: true
            })
            if (res.error) {
                toast.error("Identifiants incorrects.");
                setLoading(false);
                return;
            }

            if (data) {
                await router.invalidate();
                await router.navigate({ to: "/dashboard" });
            }

            setLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-4.5 w-full max-w-105"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="-space-y-1">
                            <FormControl>
                                <Label className="relative">
                                    <MailIcon className="absolute top-1/2 left-3 size-4.5 text-neutral-500 -translate-y-1/2" />
                                    <Input
                                        className="pl-10"
                                        placeholder="Adresse mail"
                                        value={field.value}
                                        aria-invalid={!!form.formState.errors.email}
                                        onChange={field.onChange}
                                    />
                                </Label>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="-space-y-1">
                            <FormControl>
                                <Label className="relative">
                                    <LockKeyholeIcon className="absolute size-4.5 top-1/2 left-3 text-neutral-500 -translate-y-1/2" />
                                    <Input
                                        type="password"
                                        className="pl-10"
                                        placeholder="Mot de passe"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aria-invalid={!!form.formState.errors.password}
                                    />
                                </Label>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Button type="submit" variant="action">
                        {loading ? (
                            <span className="flex justify-center items-center">
                                <Spinner />
                            </span>
                        ) : (
                            "Se connecter"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}