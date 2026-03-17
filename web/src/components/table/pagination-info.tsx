import type { PaginationState } from "@tanstack/react-table";

type PaginationInfoProps = {
    total: number;
    pagination: PaginationState
}

export default function PaginationInfo({ pagination, total }: PaginationInfoProps) {
    const { pageIndex, pageSize } = pagination;
    const count = (pageIndex + 1) * pageSize;

    return <div className="text-muted-foreground flex-1 text-sm pl-4">
        {Math.min(count, total)} résultats affichés sur {total}
    </div>
}