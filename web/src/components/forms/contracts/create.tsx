import { useSearch } from "@tanstack/react-router"
import { Activity } from "react";
import ContractForm from "./_components/contract-form";
import MandateForm from "./_components/mandate-form";



export default function CreateContract() {
    const { type }: { type: string } = useSearch({ from: "/dashboard/contracts/new-contract" });
    return (
        <>
            <Activity mode={type === "contract" ? "visible" : "hidden"}>
                <ContractForm />
            </Activity>
            <Activity mode={type === "contract" ? "hidden" : "visible"}>
                <MandateForm />
            </Activity>
        </>
    )
}
