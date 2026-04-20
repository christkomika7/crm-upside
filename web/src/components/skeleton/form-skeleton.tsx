import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
    return (
        <div className="bg-white rounded-md space-y-4 p-4">
            <Skeleton className="h-5 w-56" />
            <div className="space-y-4.5">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>

                    <div className="flex gap-2 items-end">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-20" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-16 w-full" />
                </div>

                <div className="space-x-2 grid grid-cols-3 gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>

                <div className="flex justify-center">
                    <Skeleton className="h-11 w-60" />
                </div>
            </div>
        </div>
    );
}