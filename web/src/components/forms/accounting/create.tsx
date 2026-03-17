import { useSearch } from "@tanstack/react-router"
import { Activity } from "react";
import IncomeForm from "./_components/income-form";
import OutcomeForm from "./_components/outcome-form";


export default function CreateAccounting() {
    const { type }: { type: string } = useSearch({ from: "/dashboard/accounting/new-accounting" });
    return (
        <>
            <Activity mode={type === "income" ? "visible" : "hidden"}>
                <IncomeForm />
            </Activity>
            <Activity mode={type === "outcome" ? "visible" : "hidden"}>
                <OutcomeForm />
            </Activity>
        </>
    )
}
