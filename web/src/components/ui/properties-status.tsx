import { Status, StatusLabel } from "@/components/ui/status";
import { cn, getColor } from "@/lib/utils";

type PropertiesStatusProps = {
    index: number;
    value: string;
}

export default function PropertiesStatus({ index, value }: PropertiesStatusProps) {

    return (
        <Status className={cn(getColor(index))}>
            <StatusLabel>{value}</StatusLabel>
        </Status>
    )
}
