import { useEffect, useState } from "react"
import { XIcon, PaperclipIcon, SendIcon, FileTextIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { shareReportSchema, type ShareReportSchemaType } from "@/lib/zod/share"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { apiFetch, crudService } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import InputFile from "@/components/ui/input-file"
import { toast } from "sonner"
import { queryClient } from "@/lib/query-client"
import type { Report } from "@/types/report"

type ShareProps = {
    id: string
}

export default function Share({ id }: ShareProps) {
    const [emailInput, setEmailInput] = useState("");

    const { isPending, data: report } = useQuery({
        queryKey: ["report-share", id],
        enabled: !!id,
        queryFn: () => apiFetch<Report>(`/check-in-out/${id}`),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const form = useForm<ShareReportSchemaType>({
        resolver: zodResolver(shareReportSchema),
        defaultValues: {
            id: id,
            emails: [],
            subject: "",
            message: "",
            files: [],
        },
    });

    const emails = form.watch("emails");
    const files = form.watch("files");

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            crudService.post<FormData, any>("/check-in-out/mail", data),
        onSuccess() {
            toast.success("Email envoyé avec succès");
            queryClient.invalidateQueries({ queryKey: ["share-report"] });
            const email = report?.tenant.email;
            form.reset({
                id: id,
                emails: email ? [email] : [],
                subject: "",
                message: "",
                files: [],
            });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    function addEmail() {
        const trimmed = emailInput.trim()
        if (!trimmed) return
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return
        const current = form.getValues("emails")
        if (current.includes(trimmed)) return
        form.setValue("emails", [...current, trimmed], { shouldValidate: true })
        setEmailInput("")
    }

    function removeEmail(email: string) {
        const current = form.getValues("emails")
        form.setValue("emails", current.filter((e) => e !== email), { shouldValidate: true })
    }

    function handleEmailKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addEmail()
        }
    }

    useEffect(() => {
        if (report) {
            const email = report.tenant.email;
            if (email) {
                form.setValue("emails", [email]);
            }
        }
    }, [report])

    async function submit(formData: ShareReportSchemaType) {
        const { success, data } = shareReportSchema.safeParse(formData);
        if (success && report?.id) {
            const formData = new FormData();
            formData.append("id", report.id);
            formData.append("emails", JSON.stringify(data.emails));
            formData.append("subject", data.subject ?? "");
            formData.append("message", data.message ?? "");
            if (data.files && data.files.length > 0) {
                data.files.forEach((file) => formData.append("files", file));
            }
            mutation.mutate(formData)
        }
    }

    if (isPending || !report) return <Spinner />

    const unit = report.unit.reference;
    const building = report.unit.building.name;
    const surface = report.unit.surface;
    const tenant = `${report.tenant.firstname} ${report.tenant.lastname}`;
    const date = new Date(report.date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const statusLabel = report.isChecked ? "Validé" : "En attente";

    return (
        <div className="min-h-screen flex justify-center">
            <div className="w-full flex justify-between">
                <div className="w-full flex">
                    <div className="flex-1 bg-white max-w-2xl flex flex-col rounded-lg">
                        <div className="px-8 pt-8 pb-6 border-b border-neutral-100">
                            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-400 mb-1">Partager</p>
                            <h1 className="text-xl font-semibold text-neutral-800">Envoyer par email</h1>
                        </div>

                        <Form {...form}>
                            <form key={id} onSubmit={form.handleSubmit(submit)}>
                                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="emails"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-600">Destinataires</FormLabel>
                                                <div className="space-y-1">
                                                    <Input
                                                        type="email"
                                                        value={emailInput}
                                                        onChange={(e) => setEmailInput(e.target.value)}
                                                        onKeyDown={handleEmailKeyDown}
                                                        onBlur={addEmail}
                                                        aria-invalid={!!form.formState.errors.emails?.message}
                                                        placeholder={field.value.length === 0 ? "email@exemple.com" : ""}
                                                    />
                                                    <FormMessage />
                                                    {field.value.length > 0 && (
                                                        <div className="flex flex-col items-end">
                                                            <div className="min-h-11 flex flex-wrap w-full bg-neutral-50/70 p-2 rounded-lg gap-1.5 items-center">
                                                                {field.value.map((email, index) => (
                                                                    <span key={index} className="flex items-center gap-1.5 bg-emerald-100 text-neutral-700 text-xs px-2.5 py-1 rounded-full">
                                                                        {email}
                                                                        <button onClick={() => removeEmail(email)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                                                                            <XIcon className="size-3" />
                                                                        </button>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            {emails.length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => form.setValue("emails", [])}
                                                                    className="flex cursor-pointer mt-0.5 items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors duration-150"
                                                                >
                                                                    <Trash2Icon className="size-3" />
                                                                    Vider
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-neutral-300">Entrée ou virgule pour valider</p>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-600">Objet</FormLabel>
                                                <Input
                                                    type="text"
                                                    placeholder="Objet du message"
                                                    value={field.value}
                                                    aria-invalid={!!form.formState.errors.subject}
                                                    onChange={field.onChange}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-600">Message</FormLabel>
                                                <Textarea
                                                    placeholder="Message"
                                                    value={field.value}
                                                    aria-invalid={!!form.formState.errors.subject}
                                                    onChange={field.onChange}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="files"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <InputFile
                                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                                        title="Joindre des fichiers"
                                                        multiple={true}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        error={form.formState.errors.files?.message}
                                                        icon={
                                                            <div className="flex items-center bg-blue-600/5 justify-center rounded-full p-2.5">
                                                                <PaperclipIcon className="size-6 text-blue-600" />
                                                            </div>
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="px-8 py-5 border-t border-neutral-100 flex items-center justify-between">
                                    <p className="text-xs text-neutral-400">
                                        {emails.length} destinataire{emails.length !== 1 ? "s" : ""}
                                        {files && files.length > 0 && ` · ${files.length} fichier${files.length !== 1 ? "s" : ""}`}
                                    </p>
                                    <Button
                                        variant="action"
                                        disabled={emails.length === 0 || mutation.isPending}
                                        className="w-fit"
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <Spinner className="size-4 animate-spin" />
                                                Envoie en cours...
                                            </>
                                        ) : (
                                            <>
                                                <SendIcon className="size-4" />
                                                Envoyer
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>

                <div className="w-80 shrink-0 flex flex-col gap-3">
                    <div className="rounded-2xl bg-white p-6 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <FileTextIcon className="size-4 text-emerald-600" />
                            </div>
                            <p className="text-xs font-medium tracking-widest uppercase text-neutral-400">
                                État des lieux
                            </p>
                        </div>

                        <div>
                            <p className="text-3xl font-semibold text-neutral-900 tracking-tight">{unit}</p>
                        </div>

                        <div className="h-px bg-neutral-100" />

                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Résidence", value: building },
                                { label: "Locataire", value: tenant },
                                { label: "Surface", value: `${surface} m²` },
                                { label: "Date", value: date },
                                { label: "Statut", value: statusLabel },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-0.5">
                                    <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-400">{label}</p>
                                    <p className="text-sm text-neutral-700">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}