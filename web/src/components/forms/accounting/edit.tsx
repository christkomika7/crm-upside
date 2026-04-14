import { useParams, useSearch } from "@tanstack/react-router"
import { Activity } from "react";
import EditIncomeForm from "./_components/edit-income-form";
import EditOutcomeForm from "./_components/edit-outcome-form";

export default function EditAccounting() {
    const { type }: { type: string } = useSearch({ from: "/dashboard/accounting/edit-accounting/$id" });
    const param = useParams({ from: "/dashboard/accounting/edit-accounting/$id" })
    const id = param.id.split("edit_accounting-")[1];

    return (
        <>
            <Activity mode={type === "INFLOW" ? "visible" : "hidden"}>
                <EditIncomeForm accountingType="INFLOW" id={id} />
            </Activity>
            <Activity mode={type === "OUTFLOW" ? "visible" : "hidden"}>
                <EditOutcomeForm accountingType="OUTFLOW" id={id} />
            </Activity>
        </>
    )
}
