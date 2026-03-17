import {
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { CheckIcon, ListFilterIcon } from "lucide-react";
import { Button } from "../ui/button";
import { type Dispatch, type SetStateAction } from "react";

type FilterProps = {
    setFilter: Dispatch<SetStateAction<"alpha" | "asc" | "desc">>;
    filter: "alpha" | "asc" | "desc"
}

export default function Filter({ setFilter, filter }: FilterProps) {

    function handleFilter(type: "alpha" | "asc" | "desc") {
        switch (type) {
            case "alpha":
                setFilter("alpha");
                break;
            case "asc":
                if (filter === "asc") {
                    setFilter("desc");
                } else {
                    setFilter("asc");
                }
                break;
            case "desc":
                if (filter === "desc") {
                    setFilter("asc");
                } else {
                    setFilter("desc");
                }
                break;
        }
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" > <ListFilterIcon className="size-3.5" /> Filtrer</Button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" className="w-52 p-0">
                <PopoverArrow />
                <ul className=" text-sm text-neutral-600">
                    <li className="border-b p-4 border-neutral-100 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center" onClick={() => handleFilter("alpha")}> <span className="flex size-4">{filter === "alpha" ? <CheckIcon className="size-4" /> : ""}</span> Alphabétique</li>
                    <li className="p-4 hover:bg-emerald-50 cursor-pointer flex gap-x-2 items-center" onClick={() => handleFilter("asc")}><span className="flex size-4">{filter === "asc" || filter === "desc" ? <CheckIcon className="size-4" /> : ""}</span> Croissant / Décroissant</li>
                </ul>
            </PopoverContent>
        </Popover>
    )
}