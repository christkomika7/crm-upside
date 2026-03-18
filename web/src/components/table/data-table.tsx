import { Activity, useEffect, useState } from "react";
import Filter from "../input/filter";
import Search from "../input/search";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { PAGE_SIZE } from "@/lib/constant";
import PaginationInfo from "./pagination-info";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";


type DataTableProps = {
    data: any[];
    columns: ColumnDef<any>[];
    filters: string[];
    sort?: string;
    placeholder?: string;
    hasFilter?: boolean;
    isLoading?: boolean;
}

export default function DataTable({ data = [], columns, filters, isLoading, sort = "name", hasFilter = true, placeholder = "Recherche" }: DataTableProps) {
    const [filter, setFilter] = useState<"alpha" | "asc" | "desc">("alpha");
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    console.log({ data })

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    })

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            globalFilter: search,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setSearch,
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            return filters.some((key) => {
                const value = row.original[key as keyof typeof row.original];
                return value?.toString().toLowerCase().includes(search);
            });
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });


    useEffect(() => {
        if (filter === "alpha") {
            setSorting([
                {
                    id: sort,
                    desc: false,
                },
            ]);
        }

        if (filter === "asc") {
            setSorting([
                {
                    id: "createdAt",
                    desc: false,
                },
            ]);
        }

        if (filter === "desc") {
            setSorting([
                {
                    id: "createdAt",
                    desc: true,
                },
            ]);
        }
    }, [filter]);

    const getPaginationRange = () => {
        const totalPages = table.getPageCount();
        const currentPage = table.getState().pagination.pageIndex;
        const delta = 1;

        const range: (number | "ellipsis")[] = [];

        const left = Math.max(0, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        if (left > 0) {
            range.push(0);
            if (left > 1) range.push("ellipsis");
        }

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < totalPages - 1) {
            if (right < totalPages - 2) range.push("ellipsis");
            range.push(totalPages - 1);
        }

        return range;
    };

    return (
        <div className="bg-white rounded-md gap-4 w-full">
            <Activity mode={hasFilter ? "visible" : "hidden"}>
                <div className="flex justify-between items-center gap-x-2 p-4 border-b border-neutral-200">
                    <Search placeholder={placeholder} setSearch={setSearch} search={search} />
                    <Filter setFilter={setFilter} filter={filter} />
                </div>
            </Activity>
            <div className="p-4">
                <div className="w-full">
                    <div className="overflow-hidden rounded-md">
                        <Table>
                            <TableHeader className="bg-neutral-100 rounded-md">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="border-none h-10">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} className="px-4">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-32 text-center"
                                        >
                                            <div className="flex items-center justify-center gap-2 text-neutral-500">
                                                <Spinner className="w-5 h-5 animate-spin" />
                                                Chargement des données...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows?.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={
                                                cn("h-11 border-neutral-100",
                                                    { "bg-red-100/60! ": row.original.isDeleting }
                                                )}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="px-4 text-sm text-neutral-600"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center text-neutral-500"
                                        >
                                            Aucun résultat trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <Activity mode={data.length > PAGE_SIZE ? 'visible' : 'hidden'}>
                        <div className="flex items-center justify-end space-x-2 py-4">

                            <PaginationInfo pagination={table.getState().pagination} total={table.getFilteredRowModel().rows.length} />
                            <div className="space-x-2 pr-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => table.previousPage()}
                                                className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "text-emerald-700 font-semibold"}
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
                                                        isActive={item === table.getState().pagination.pageIndex}
                                                        onClick={() => table.setPageIndex(item)}
                                                    >
                                                        {item + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => table.nextPage()}
                                                className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "text-emerald-700 font-semibold"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </Activity>
                </div>
            </div>
        </div>
    )
}
