import RecordDocument from "@/components/document/record";
import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch, crudService } from "@/lib/api";
import { renderComponentToPDF } from "@/lib/document";
import { queryClient } from "@/lib/query-client";
import { cn, formatNumber } from "@/lib/utils";
import type { QuoteTab } from "@/types/quote";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { Document as DocumentType } from "@/types/document";
import { ArrowUpDownIcon, Edit3Icon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Activity, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";


export const columns: ColumnDef<QuoteTab>[] = [
    {
        accessorKey: "reference",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Reference
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("reference")}</div>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className={cn("capitalize", {
                "text-blue-500": row.getValue("type") === "TENANT",
                "text-amber-400": row.getValue("type") === "OWNER"
            })}>{row.getValue("type") === "TENANT" ? "Locataire" : "Propriétaire"}</div>
        ),
    },
    {
        accessorKey: "client",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Client
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("client")}</div>
        ),
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Montant
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{formatNumber(row.getValue("amount"))} FCFA</div>
        ),
    },
    {
        accessorKey: "issue",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date d'emission
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("issue")}</div>
        ),
    },
    {
        accessorKey: "due",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date d'échéance
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("due")}</div>
        ),
    },
    {
        id: "id",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const router = useRouter();
            const [loading, setLoading] = useState(false);

            const { isPending: isGettingQuote, data: quote } = useQuery({
                queryKey: ["quote-document", row.original.id],
                enabled: !!row.original.id,
                queryFn: () => apiFetch<DocumentType>(`/document/${row.original.id}?type=QUOTE`),
                staleTime: 0,
                gcTime: 0,
                refetchOnMount: "always",
                refetchOnWindowFocus: true,
            });

            const remove = useMutation({
                mutationFn: ({ quoteId }: { quoteId: string }) =>
                    crudService.delete(`/quote/${quoteId}`),
                onSuccess() {
                    queryClient.invalidateQueries({ queryKey: ["quotes"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });


            const duplicate = useMutation({
                mutationFn: ({ quoteId }: { quoteId: string }) =>
                    crudService.get(`/quote/duplicate/${quoteId}`),
                onSuccess() {
                    queryClient.invalidateQueries({ queryKey: ["quotes"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            const convert = useMutation({
                mutationFn: ({ quoteId }: { quoteId: string }) =>
                    crudService.get(`/quote/convert/${quoteId}`),
                onSuccess() {
                    queryClient.invalidateQueries({ queryKey: ["quotes"] });
                },
                onError: (error: Error) => {
                    console.error("Erreur:", error.message);
                    toast.error(error.message);
                },
            });

            async function convertPdfToFile(quote: DocumentType, filename: string) {
                const pdfData = await renderComponentToPDF(
                    <RecordDocument id={row.original.id} title="Devis" type="QUOTE" data={quote} />
                    , {
                        padding: 0,
                        margin: 0,
                        quality: 0.98,
                        scale: 4,
                        headerText: `- ${filename} - ${new Date().toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}`
                    })
                const blob = new Blob([pdfData], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = filename;

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }

            async function downloadPdf() {
                if (quote) {
                    setLoading(true);

                    const filename = `Devis ${quote.reference}.pdf`;
                    const start = Date.now();
                    await convertPdfToFile(quote, filename);
                    const elapsed = Date.now() - start;
                    const remaining = Math.max(0, 800 - elapsed);

                    setTimeout(() => {
                        setLoading(false);
                    }, remaining);
                }
            }

            return (
                <div className="flex gap-x-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="size-7.5 rounded-lg"><EllipsisVerticalIcon className="size-3.5" /></Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" side="bottom" className="w-52 p-0">
                            <PopoverArrow />
                            <ul className=" text-sm text-neutral-600">
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate(
                                        {
                                            to: "/dashboard/quotes/edit-quote/$id",
                                            params: { id: `edit_quote-${row.original.id}` },
                                            search: { type: 'preview' }
                                        }
                                    )}
                                >
                                    Aperçu
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => router.navigate(
                                        {
                                            to: "/dashboard/quotes/edit-quote/$id",
                                            params: { id: `edit_quote-${row.original.id}` },
                                            search: { type: 'share' }
                                        }
                                    )}
                                >
                                    Partager
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => duplicate.mutate({ quoteId: row.original.id })}
                                >Dupliquer {duplicate.isPending && <Spinner />}
                                </li>
                                <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                    onClick={() => convert.mutate({ quoteId: row.original.id })}
                                >Convertir en facture {convert.isPending && <Spinner />}
                                </li>
                                <Activity mode={isGettingQuote ? "visible" : "hidden"}>
                                    <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center">
                                        <Skeleton className="w-40 h-2" />
                                    </li>
                                </Activity>
                                <Activity mode={isGettingQuote ? "hidden" : "visible"}>
                                    <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center"
                                        onClick={() => downloadPdf()}
                                    >Télécharger le devis {loading && <Spinner />} </li>
                                </Activity>
                            </ul>
                        </PopoverContent>
                    </Popover>
                    <Link to="/dashboard/quotes/edit-quote/$id"
                        params={{ id: `edit_quote-${row.original.id}` }}
                        search={{ type: row.original.type }}
                    >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Button onClick={() => remove.mutate({ quoteId: row.original.id })} variant="destructive" className="size-7.5 rounded-lg bg-red-400">
                        {remove.isPending ? <Spinner className="text-white size-3.5" /> : <Trash2Icon className="size-3.5" />}
                    </Button>
                </div>
            )
        },
    },
]