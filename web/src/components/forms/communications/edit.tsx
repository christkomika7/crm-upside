import { useSearch } from "@tanstack/react-router"
import { Activity } from "react";
import LetterForm from "./_components/letter-form";
import NoteForm from "./_components/note-form";



export default function EditCommunication() {
    const { type }: { type: string } = useSearch({ from: "/dashboard/communications/edit-communication/$id" });
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
