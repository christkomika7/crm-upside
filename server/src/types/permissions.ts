import { modules } from "../lib/zod/permissions";

export type PermissionAction = "read" | "create" | "update";
type key = typeof modules[number];

export type ModulePermission = {
    read: boolean;
    create: boolean;
    update: boolean;
};

export type Permissions = {
    id: string;
    userId: string;
    permissions: Permission;
    createdAt: Date;
}

export type Permission = Record<key, ModulePermission>;