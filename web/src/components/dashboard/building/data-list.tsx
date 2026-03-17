import DataTable from "@/components/table/data-table"
import { columns as unitColumn, data as unitData } from "@/lib/tables/building/properties"

export default function DataList() {
    return (
        <div className="bg-white rounded-md shadow-md shadow-neutral-300/10 flex justify-between items-center">
            <DataTable data={unitData} columns={unitColumn} filters={[]} hasFilter={false} />
        </div>
    )
}
