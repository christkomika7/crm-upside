import { useSearch } from "@tanstack/react-router"
import { Activity } from "react";
import NoteForm from "./_components/note-form";
import LetterForm from "./_components/letter-form";


export default function CreateCommunication() {
    const { type }: { type: string } = useSearch({ from: "/dashboard/communications/new-communication" });
    return (
        <>
            <Activity mode={type === "note" ? "visible" : "hidden"}>
                <NoteForm />
            </Activity>
            <Activity mode={type === "letter" ? "visible" : "hidden"}>
                <LetterForm />
            </Activity>
        </>
    )
}
