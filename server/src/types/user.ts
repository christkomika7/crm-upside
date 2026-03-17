import { Role } from "./db";
import { Permissions } from "./permissions";

export type User = {
    id: string;
    image?: string;
    name: string;
    email: string;
    role: Role;
    permission: Permissions;
    createdAt: Date;
}