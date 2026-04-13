import { actions, modules, type ActionType, type ModuleType } from "./zod/permissions";


type Permission = {
    [K in ModuleType]?: ActionType[];
};

function parsePermissions(raw: Object): Permission {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

    const result: Permission = {};

    for (const module of modules) {
        const value = (raw as Record<string, unknown>)[module];
        if (Array.isArray(value)) {
            result[module] = value.filter((v): v is ActionType =>
                actions.includes(v as ActionType)
            );
        }
    }

    return result;
}

export function canAccess(
    raw: Object | null | undefined,
    module: ModuleType,
    actions: ActionType | ActionType[] | "read"
): boolean {
    if (!raw) return false;

    const permissions = parsePermissions(raw);
    const modulePerms: ActionType[] = permissions[module] ?? [];

    const requiredActions = Array.isArray(actions) ? actions : [actions];

    if (requiredActions.includes("read")) {
        if (
            modulePerms.length > 0 ||
            modulePerms.includes("create") ||
            modulePerms.includes("update")
        ) {
            return true;
        }
    }

    return requiredActions.some(action => modulePerms.includes(action));
}