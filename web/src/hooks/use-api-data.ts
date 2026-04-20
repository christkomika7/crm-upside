import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "@/lib/constant";
import { apiFetch } from "@/lib/api";
import { type FilterType, type ApiResponse } from "@/types/response";

type SortState = { id: string; desc: boolean } | null;

type Props = {
    url: string
    pageSize?: number
    key: string
}

export function useApiData<T>({ url, key, pageSize = PAGE_SIZE }: Props) {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("alpha");
    const [sort, setSort] = useState<SortState>(null);

    const { data, isPending } = useQuery({
        queryKey: [key, page, search, filter, sort],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                search,
                filter,
                ...(sort && {
                    sortBy: sort.id,
                    sortOrder: sort.desc ? "desc" : "asc",
                }),
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

    const handleSortChange = (value: SortState) => {
        setSort(value);
        setPage(0);
    };

    return {
        data: data?.data ?? [],
        total: data?.total ?? 0,
        pageCount: data?.pageCount ?? 0,
        page,
        search,
        filter,
        sort,
        isPending,
        onPageChange: setPage,
        onSearchChange: handleSearchChange,
        onFilterChange: handleFilterChange,
        onSortChange: handleSortChange,
    };
}