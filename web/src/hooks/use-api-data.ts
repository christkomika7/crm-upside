import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "@/lib/constant";
import { apiFetch } from "@/lib/api";
import { type FilterType, type ApiResponse } from "@/types/response";

type Props = {
    url: string
    pageSize?: number
}


export function useApiData<T>({ url, pageSize = PAGE_SIZE }: Props) {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("alpha");

    const { data, isPending } = useQuery({
        queryKey: ["units", page, search, filter],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                search,
                filter,
            });
            return await apiFetch<ApiResponse<T>>(`${url}?${params}`);
        },
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(0);
    };

    const handleFilterChange = (value: FilterType) => {
        setFilter(value);
        setPage(0);
    };

    return {
        units: data?.data ?? [],
        total: data?.total ?? 0,
        pageCount: data?.pageCount ?? 0,
        page,
        search,
        filter,
        isPending,
        onPageChange: setPage,
        onSearchChange: handleSearchChange,
        onFilterChange: handleFilterChange,
    };
}