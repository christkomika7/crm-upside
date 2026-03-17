import type { User } from "./user";

type Session = {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    ipAddress: string;
    userAgent: string;
};

export type AuthSession = {
    data: {
        user: User;
        session: Session;
    } | null;
    error: null | {
        message: string;
        status: number;
    };
};