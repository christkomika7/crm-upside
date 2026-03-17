import { useSearch } from "@tanstack/react-router"
import { Activity } from "react";
import EditContractForm from "./_components/edit-contract-form";
import EditMandateForm from "./_components/edit-mandate-form";



export default function EditContract() {
    const { type }: { type: string } = useSearch({ from: "/dashboard/contracts/edit-contract/$id" });
    return (
        <>
            <Activity mode={type === "contract" ? "visible" : "hidden"}>
                <EditContractForm />
            </Activity>
            <Activity mode={type === "contract" ? "hidden" : "visible"}>
                <EditMandateForm />
            </Activity>
        </>
    )
}
