import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { apiFetch } from "@/lib/api";
import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

type ReportDocProps = {
    id: string;
};

export default function ReportDoc({ id }: ReportDocProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: pdfBlob, isPending } = useQuery({
        queryKey: ["report-pdf", id],
        enabled: !!id,
        queryFn: () => apiFetch<ArrayBuffer>(`/check-in-out/template/${id}`, {
            responseType: "arrayBuffer",
        }),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
    });

    useEffect(() => {
        if (!pdfBlob || !containerRef.current) return;

        containerRef.current.innerHTML = "";

        const loadPdf = async () => {
            const pdf = await pdfjsLib.getDocument({ data: pdfBlob }).promise;

            const containerWidth = containerRef.current!.clientWidth;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);

                const viewport = page.getViewport({ scale: 1 });

                const scale = containerWidth / viewport.width;

                const scaledViewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d")!;

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;

                await page.render({
                    canvasContext: ctx,
                    canvas,
                    viewport: scaledViewport,
                }).promise;

                const pageWrapper = document.createElement("div");
                pageWrapper.style.cssText = `
            background: white;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 16px;
            width: 100%;
        `;

                canvas.style.cssText = `
            width: 100%;
            height: auto;
            display: block;
        `;

                pageWrapper.appendChild(canvas);
                containerRef.current?.appendChild(pageWrapper);
            }
        };

        loadPdf().catch(console.error);
    }, [pdfBlob]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center w-full h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-transparent"
        />
    );
}