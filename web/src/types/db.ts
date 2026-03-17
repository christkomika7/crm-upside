export const Role = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    OWNER: 'OWNER',
    TENANT: 'TENANT'
} as const;

export type Role = typeof Role[keyof typeof Role];