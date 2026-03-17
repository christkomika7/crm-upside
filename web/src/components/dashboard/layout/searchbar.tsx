import { SearchIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Searchbar() {
    return (
        <Label className="w-125 h-10 grid grid-cols-[1fr_1px_120px_60px] gap-0 border-neutral-200 rounded-full border">
            <Input className="border-none focus-visible:border-0 focus-visible:ring-0 rounded-full h-10!" placeholder="Recherchez ce que vous cherchez" />
            <span className="h-5 w-px bg-neutral-200" />
            <Select>
                <SelectTrigger className="h-10! w-full border-none shadow-none rounded-none">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent align="start" position="popper">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="action" className="h-10! rounded-full w-full">
                <SearchIcon className="size-4" />
            </Button>
        </Label>
    )
}
