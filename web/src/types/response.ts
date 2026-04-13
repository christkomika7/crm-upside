export type FilterType = "alpha" | "asc" | "desc";

export type ApiResponse<T> = {
    data: T[];
    total: number;
    pageCount: number;
    page: number;
    search: string;
    filter: FilterType;
    isPending: boolean;
    onPageChange: (page: number) => void;
    onSearchChange: (search: string) => void;
    onFilterChange: (filter: FilterType) => void;
}