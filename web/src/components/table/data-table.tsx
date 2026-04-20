import { useEffect, useState } from "react";
import Filter from "../input/filter";
import Search from "../input/search";

import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import {
    flexRender, getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, useReactTable,
    type ColumnDef, type SortingState,
} from "@tanstack/react-table"
import {
    Pagination, PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { PAGE_SIZE } from "@/lib/constant";
import PaginationInfo from "./pagination-info";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

type FilterType = "alpha" | "asc" | "desc";
type SortState = { id: string; desc: boolean } | null;

type DataTableProps = {
    data: any[];
    columns: ColumnDef<any>[];
    filters: string[];
    sort?: string;
    placeholder?: string;
    hasFilter?: boolean;
    isLoading?: boolean;
    serverSide?: boolean;
    total?: number;
    pageCount?: number;
    page?: number;
    onPageChange?: (page: number) => void;
    search?: string;
    onSearchChange?: (search: string) => void;
    filter?: FilterType;
    onFilterChange?: (filter: FilterType) => void;
    onSortChange?: (sort: SortState) => void;
}

export default function DataTable({
    data = [],
    columns,
    filters,
    isLoading,
    sort = "name",
    hasFilter = true,
    placeholder = "Recherche",
    serverSide = false,
    total = 0,
    pageCount = 0,
    page: externalPage = 0,
    onPageChange,
    search: externalSearch,
    onSearchChange,
    filter: externalFilter,
    onFilterChange,
    onSortChange,
}: DataTableProps) {
    const [localFilter, setLocalFilter] = useState<FilterType>("alpha");
    const [localSearch, setLocalSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    const [localPagination, setLocalPagination] = useState({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const activeSearch = serverSide ? externalSearch ?? "" : localSearch;
    const activeFilter = serverSide ? externalFilter ?? "alpha" : localFilter;

    const handleSortingChange = (updater: any) => {
        const next: SortingState =
            typeof updater === "function" ? updater(sorting) : updater;
        setSorting(next);
        if (serverSide) {
            onSortChange?.(next[0] ?? null);
        }
    };

    const table = useReactTable({
        data,
        columns,
        manualPagination: serverSide,
        manualFiltering: serverSide,
        manualSorting: serverSide,
        pageCount: serverSide ? pageCount : undefined,
        state: {
            sorting,
            pagination: serverSide
                ? { pageIndex: externalPage, pageSize: PAGE_SIZE }
                : localPagination,
            globalFilter: serverSide ? undefined : localSearch,
        },
        onSortingChange: handleSortingChange,
        onGlobalFilterChange: serverSide ? undefined : setLocalSearch,
        globalFilterFn: serverSide
            ? undefined
            : (row, _columnId, filterValue) => {
                const search = filterValue.toLowerCase();
                return filters.some((key) => {
                    const value = row.original[key as keyof typeof row.original];
                    return value?.toString().toLowerCase().includes(search);
                });
            },
        onPaginationChange: serverSide ? undefined : setLocalPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
        getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    });

    useEffect(() => {
        if (serverSide) return;
        if (localFilter === "alpha") {
            setSorting([{ id: sort, desc: false }]);
        } else if (localFilter === "asc") {
            setSorting([{ id: "createdAt", desc: false }]);
        } else if (localFilter === "desc") {
            setSorting([{ id: "createdAt", desc: true }]);
        }
    }, [localFilter, serverSide, sort]);

    const handleSearchChange = (value: string) => {
        if (serverSide) onSearchChange?.(value);
        else setLocalSearch(value);
    };

    const handleFilterChange = (value: FilterType) => {
        if (serverSide) onFilterChange?.(value);
        else setLocalFilter(value);
    };

    const handlePageChange = (newPage: number) => {
        if (serverSide) onPageChange?.(newPage);
        else setLocalPagination((prev) => ({ ...prev, pageIndex: newPage }));
    };

    const resolvedPageCount = serverSide ? pageCount : table.getPageCount();
    const resolvedPageIndex = serverSide ? externalPage : table.getState().pagination.pageIndex;
    const resolvedTotal = serverSide ? total : table.getFilteredRowModel().rows.length;

    const canPreviousPage = resolvedPageIndex > 0;
    const canNextPage = resolvedPageIndex < resolvedPageCount - 1;

    const getPaginationRange = () => {
        const totalPages = resolvedPageCount;
        const currentPage = resolvedPageIndex;
        const delta = 1;
        const range: (number | "ellipsis")[] = [];
        const left = Math.max(0, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        if (left > 0) {
            range.push(0);
            if (left > 1) range.push("ellipsis");
        }
        for (let i = left; i <= right; i++) range.push(i);
        if (right < totalPages - 1) {
            if (right < totalPages - 2) range.push("ellipsis");
            range.push(totalPages - 1);
        }
        return range;
    };

    const showPagination = serverSide
        ? resolvedPageCount > 1
        : data.length > PAGE_SIZE;

    return (
        <div className="bg-white rounded-md gap-4 w-full">
            {hasFilter && (
                <div className="flex justify-between items-center gap-x-2 p-4 border-b border-neutral-200">
                    <Search
                        placeholder={placeholder}
                        setSearch={handleSearchChange}
                        search={activeSearch}
                    />
                    <Filter setFilter={handleFilterChange} filter={activeFilter} />
                </div>
            )}
            <div className="p-4">
                <div className="w-full">
                    <div className="overflow-hidden rounded-md">
                        <Table>
                            <TableHeader className="bg-neutral-100 rounded-md">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="border-none h-10">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="px-4">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-32 text-center">
                                            <div className="flex items-center justify-center gap-2 text-neutral-500">
                                                <Spinner className="w-5 h-5 animate-spin" />
                                                Chargement des données...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={cn(
                                                "h-11 border-neutral-100",
                                                { "bg-emerald-100!": !row.original.isDeleting && row.original?.isToday },
                                                { "bg-red-100/60!": row.original.isDeleting },
                                            )}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-4 text-sm text-neutral-600">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center text-neutral-500">
                                            Aucun résultat trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {showPagination && (
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <PaginationInfo
                                pagination={{ pageIndex: resolvedPageIndex, pageSize: PAGE_SIZE }}
                                total={resolvedTotal}
                            />
                            <div className="space-x-2 pr-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => canPreviousPage && handlePageChange(resolvedPageIndex - 1)}
                                                className={!canPreviousPage ? "pointer-events-none opacity-50" : "text-emerald-700 font-semibold"}
                                            />
                                        </PaginationItem>

                                        {getPaginationRange().map((item, index) => {
                                            if (item === "ellipsis") {
                                                return (
                                                    <PaginationItem key={`ellipsis-${index}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }
                                            return (
                                                <PaginationItem key={item}>
                                                    <PaginationLink
                                                        isActive={item === resolvedPageIndex}
                                                        onClick={() => handlePageChange(item)}
                                                    >
                                                        {item + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => canNextPage && handlePageChange(resolvedPageIndex + 1)}
                                                className={!canNextPage ? "pointer-events-none opacity-50" : "text-emerald-700 font-semibold"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}