import { Role } from "./db";
import type { Permissions } from "./permissions";

export type User = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    name: string;
    emailVerified: boolean;
    role: Role;
    createdAt: string;
    updatedAt: string;
    image?: string;
    permission: Permissions | null;
};
