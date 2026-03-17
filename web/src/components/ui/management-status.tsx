import { Status, StatusLabel } from "@/components/ui/status";

export type ManagementStatusKey = 'pool' | 'garden' | 'gym';

const managementStatusData: Record<ManagementStatusKey, string> = {
    "pool": "Piscine",
    "garden": "Jardin",
    "gym": "Salle de sport",
}

type ManagementStatusProps = {
    value: ManagementStatusKey;
}


export default function ManagementStatus({ value }: ManagementStatusProps) {
    function getColor(value: ManagementStatusKey) {
        switch (value) {
            case "pool":
                return "emerald"
            case "garden":
                return "amber"
            case "gym":
                return "indigo"
        }

    }
    return (
        <Status variant={getColor(value)}>
            <StatusLabel>{managementStatusData[value]}</StatusLabel>
        </Status>
    )
}
