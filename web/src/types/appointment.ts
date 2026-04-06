export type Appointment = {
    id: string;
    date: Date;
    hour: string;
    minutes: string;
    subject: string;
    ownerId: string;
    tenantId: string;
    address: string;
    note: string;
    type: "OWNER" | "TENANT";
    isComplete: boolean;
    teamMembers: string[];
}

export type AppointmentTab = {
    id: string;
    date: string;
    subject: string;
    address: string;
    isComplete: boolean;
    client: string;
    isToday: boolean;
    members: string[];
    createdAt: Date;
}

export type AppointmentStats = {
    today: number;
    expired: number;
    completed: number;
    upcoming: string | null;
}