import clsx from "clsx";
import { useState, useCallback, useEffect } from "react";
import { Spinner } from "../ui/spinner";

export interface DataRow {
    property: string;
    value: string | React.ReactNode;
}

export interface PropertyCardProps {
    files?: string[];
    urlToFile?: (url: string) => Promise<File>;
    title?: string;
    about?: string;
    data: DataRow[];
    size?: number;
    isLoading?: boolean;
}

const IMAGE_MIME = /^image\//i;

const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='260' viewBox='0 0 220 260'%3E%3Crect width='220' height='260' fill='%23F1EFE8'/%3E%3Cpath d='M70 165 L110 118 L150 165 Z' fill='%23D3D1C7'/%3E%3Crect x='88' y='140' width='44' height='25' fill='%23D3D1C7'/%3E%3Crect x='94' y='145' width='12' height='20' fill='%23F1EFE8'/%3E%3Crect x='114' y='145' width='12' height='20' fill='%23F1EFE8'/%3E%3C/svg%3E";

interface ResolvedFile {
    url: string;
    file: File;
    isImage: boolean;
}

function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`bg-neutral-200 rounded animate-pulse ${className ?? ""}`} />
    );
}

function PropertyCardSkeleton({ hasFiles }: { hasFiles?: boolean }) {
    const widths = ["max-w-[45%]", "max-w-[63%]", "max-w-[75%]"];
    return (
        <div className="bg-white rounded-md shadow-md shadow-neutral-300/10 overflow-hidden w-full">
            <div className="flex">
                {hasFiles && (
                    <div className="w-[350px] h-[300px] shrink-0">
                        <Skeleton className="w-full h-full rounded-none rounded-tl-md" />
                    </div>
                )}
                <div className="flex-1 min-w-0 p-5 pb-4">
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-3 w-[30%] shrink-0" />
                                <Skeleton className={clsx("h-3 flex-1 w-full", widths[i % 3])} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {direction === "left" ? (
                <path d="M11 13L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
                <path d="M7 5L11 9L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
        </svg>
    );
}

function DownloadIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 10.5L3.5 6.5H6V2H9V6.5H11.5L7.5 10.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M2 12.5H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2H8.5L11 4.5V12H3V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M8.5 2V4.5H11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M5 7H9M5 9.5H9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
    );
}

function ImageCarousel({ images }: { images: ResolvedFile[] }) {
    const [current, setCurrent] = useState(0);
    const [imgError, setImgError] = useState<Record<number, boolean>>({});

    const prev = useCallback(
        () => setCurrent((c) => (c - 1 + images.length) % images.length),
        [images.length]
    );
    const next = useCallback(
        () => setCurrent((c) => (c + 1) % images.length),
        [images.length]
    );

    const src = imgError[current] ? PLACEHOLDER : images[current].url;

    return (
        <div className="relative w-[350px] h-[300px] shrink-0 group overflow-hidden rounded-tl-md">
            <img
                key={current}
                src={src}
                alt={images[current].file.name || `Image ${current + 1}`}
                onError={() => setImgError((prev) => ({ ...prev, [current]: true }))}
                className="w-full h-full object-cover block transition-opacity duration-200"
            />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-white"
                        aria-label="Image précédente"
                    >
                        <ChevronIcon direction="left" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-white"
                        aria-label="Image suivante"
                    >
                        <ChevronIcon direction="right" />
                    </button>

                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                aria-label={`Aller à l'image ${i + 1}`}
                                className={clsx(
                                    "rounded-full transition-all duration-200",
                                    i === current
                                        ? "w-5 h-1.5 bg-white"
                                        : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                                )}
                            />
                        ))}
                    </div>

                    <div className="absolute top-2.5 right-2.5 bg-black/40 text-white text-[11px] font-medium px-2 py-0.5 rounded-full leading-relaxed">
                        {current + 1}/{images.length}
                    </div>
                </>
            )}
        </div>
    );
}

function DownloadButton({ files }: { files: ResolvedFile[] }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadAll = async () => {
        setDownloading(true);
        try {
            for (const { file, url } of files) {
                const objectUrl = URL.createObjectURL(file);
                const a = document.createElement("a");
                a.href = objectUrl;
                a.download = file.name || url.split("/").pop() || "fichier";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(objectUrl);
                await new Promise((r) => setTimeout(r, 200));
            }
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownloadAll}
            disabled={downloading}
            className={clsx(
                "inline-flex items-center gap-2 px-2 py-2 rounded-md text-[13px] font-medium transition-all duration-150 select-none",
                "border border-neutral-200 text-neutral-600",
                "hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800",
                "active:scale-[0.97]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
        >

            {downloading
                ? <Spinner />
                : <DownloadIcon />
            }
        </button>
    );
}

function DocumentList({ files }: { files: ResolvedFile[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {files.map(({ file, url }, i) => {
                const name = file.name || url.split("/").pop() || `Document ${i + 1}`;
                const ext = name.split(".").pop()?.toUpperCase() ?? "FILE";
                const objectUrl = URL.createObjectURL(file);
                return (
                    <a
                        key={i}
                        href={objectUrl}
                        download={name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-[12px] text-neutral-600 font-medium hover:bg-neutral-100 hover:border-neutral-300 hover:text-neutral-800 transition-all duration-150 no-underline"
                    >
                        <FileIcon />
                        <span className="max-w-[120px] truncate">{name}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">{ext}</span>
                    </a>
                );
            })}
        </div>
    );
}

export default function PropertyCard({
    files = undefined,
    urlToFile,
    title,
    about,
    data,
    size = 200,
    isLoading = false,
}: PropertyCardProps) {
    const [resolvedFiles, setResolvedFiles] = useState<ResolvedFile[]>([]);
    const [resolving, setResolving] = useState(false);

    useEffect(() => {
        if (files && files.length > 0) {
            if (urlToFile) {
                setResolving(true);
                Promise.all(
                    files.map(async (url) => {
                        const file = await urlToFile(url);
                        return { url, file, isImage: IMAGE_MIME.test(file.type) } satisfies ResolvedFile;
                    })
                )
                    .then(setResolvedFiles)
                    .finally(() => setResolving(false));
            }
        }
    }, [files, urlToFile]);

    const images = resolvedFiles.filter((f) => f.isImage);
    const documents = resolvedFiles.filter((f) => !f.isImage);

    if (isLoading || resolving) {
        return <PropertyCardSkeleton hasFiles={files && files.length > 0} />;
    }

    return (
        <div className="bg-white min-h-32 rounded-md shadow-md shadow-neutral-300/10 overflow-hidden w-full">
            <div className="flex">
                {files && images.length > 0 && <ImageCarousel images={images} />}
                {files && images.length === 0 && <div className="relative w-[350px] h-[300px] shrink-0 group overflow-hidden rounded-tl-md">
                    <img
                        src={PLACEHOLDER}
                        alt="Placeholder"
                        className="w-full h-full object-cover block transition-opacity duration-200"
                    />
                </div>}
                <div className="flex-1 relative min-w-0 p-5 pb-4">
                    {images.length > 0 &&
                        <div className="absolute top-2 right-2">
                            <DownloadButton files={images} />
                        </div>
                    }

                    {title && (
                        <h2 className="text-[17px] font-medium text-gray-900 mt-0 mb-3 leading-snug">
                            {title}
                        </h2>
                    )}
                    <table className="w-full border-collapse">
                        <tbody>
                            {data.map(({ property, value }) => {
                                const isEmail =
                                    typeof value === "string" && value.includes("@");
                                return (
                                    <tr key={property}>
                                        <td
                                            className="py-[5px] pr-3 text-sm text-neutral-700 whitespace-nowrap align-top"
                                            style={{ width: size }}
                                        >
                                            {property}
                                        </td>
                                        <td className="py-[5px] text-sm font-medium text-black text-left wrap-break-word">
                                            {isEmail ? (
                                                <a
                                                    href={`mailto:${value}`}
                                                    className="text-blue-600 no-underline font-medium"
                                                >
                                                    {value}
                                                </a>
                                            ) : (
                                                value
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {about && (
                <div className="px-5 py-4 border-t leading-relaxed m-0 border-black/8 space-y-0.5">
                    <h2>A Propos</h2>
                    <p className="text-[13px] text-gray-500">{about}</p>
                </div>
            )}

            {documents.length > 0 && (
                <div className="px-5 py-4 border-t border-black/8 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">
                            Documents
                        </span>
                        <DownloadButton files={documents} />
                    </div>
                    <DocumentList files={documents} />
                </div>
            )}
        </div>
    );
}