import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    EditIcon, KeySquareIcon,
    AtSignIcon, LockIcon, XIcon, UsersIcon
} from "lucide-react";
import EditUser from "./edit";
import SetPermissions from "./set-permissions";
import EditUserEmail from "./edit-email";
import EditUserPassword from "./edit-password";
import Modal from "@/components/modal/modal";
import type { User } from "@/types/user";
import { Activity, useState } from "react";
import { initials } from "@/lib/utils";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { Spinner } from "@/components/ui/spinner";


function UserSkeleton() {
    return (
        <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded-md" />
                <Skeleton className="h-3 w-48 rounded-md" />
            </div>
            <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="size-8 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

function EmptyUsers() {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <UsersIcon className="size-5 text-neutral-400" />
            </div>
            <div className="space-y-1 text-center">
                <p className="text-sm font-medium text-neutral-700">Aucun utilisateur</p>
                <p className="text-xs text-neutral-400">
                    Il n'y a aucun utilisateur enregistré pour le moment.
                </p>
            </div>
        </div>
    );
}

type ActionButtonProps = {
    colorClass: string;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
};

function ActionButton({ colorClass, children, onClick, disabled, title }: ActionButtonProps) {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`size-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
        >
            {children}
        </button>
    );
}

function UserItem({ user }: { user: User }) {
    const [open, setOpen] = useState({
        edit: false,
        email: false,
        password: false,
        permissions: false,
    });

    const removeUser = useMutation({
        mutationFn: (userId: string) => crudService.delete(`/users/${userId}`),
        onSuccess() {
            toast.success("Utilisateur supprimé avec succès");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const isAdmin = user.role === "ADMIN";

    return (
        <div className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white border border-neutral-100 hover:border-neutral-200 transition-all duration-150">
            <Avatar className="size-10 shrink-0">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-xs font-medium bg-neutral-100 text-neutral-600">
                    {initials(user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-neutral-800 truncate">{user.name}</p>
                    {isAdmin && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                            Admin
                        </span>
                    )}
                </div>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
                <Modal
                    open={open.edit}
                    setOpen={() => setOpen({ ...open, edit: !open.edit })}
                    title="Modifier l'utilisateur"
                    action={
                        <ActionButton title="Modifier" colorClass="text-amber-500 bg-amber-50 hover:bg-amber-100 border border-amber-100">
                            <EditIcon className="size-3.5" />
                        </ActionButton>
                    }
                >
                    <EditUser
                        id={user.id}
                        firstname={user.firstname}
                        lastname={user.lastname}
                        image={user.image}
                        close={() => setOpen({ ...open, edit: false })}
                    />
                </Modal>

                <Modal
                    open={open.permissions}
                    setOpen={() => setOpen({ ...open, permissions: !open.permissions })}
                    className="max-w-5xl!"
                    title="Modifier les permissions"
                    action={
                        <ActionButton title="Permissions" colorClass="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100">
                            <KeySquareIcon className="size-3.5" />
                        </ActionButton>
                    }
                >
                    <SetPermissions
                        id={user.id}
                        permission={user.permission?.permissions}
                        close={() => setOpen({ ...open, permissions: false })}
                    />
                </Modal>

                <Modal
                    open={open.email}
                    setOpen={() => setOpen({ ...open, email: !open.email })}
                    title="Modifier l'email"
                    action={
                        <ActionButton title="Modifier l'email" colorClass="text-indigo-500 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100">
                            <AtSignIcon className="size-3.5" />
                        </ActionButton>
                    }
                >
                    <EditUserEmail
                        id={user.id}
                        email={user.email}
                        close={() => setOpen({ ...open, email: false })}
                    />
                </Modal>

                <Modal
                    open={open.password}
                    setOpen={() => setOpen({ ...open, password: !open.password })}
                    title="Modifier le mot de passe"
                    action={
                        <ActionButton title="Modifier le mot de passe" colorClass="text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-100">
                            <LockIcon className="size-3.5" />
                        </ActionButton>
                    }
                >
                    <EditUserPassword
                        id={user.id}
                        close={() => setOpen({ ...open, password: false })}
                    />
                </Modal>

                <Activity mode={isAdmin ? "hidden" : "visible"}>
                    <ActionButton
                        title="Supprimer"
                        colorClass="text-red-400 bg-red-50 hover:bg-red-100 border border-red-100"
                        onClick={() => removeUser.mutate(user.id)}
                        disabled={removeUser.isPending}
                    >
                        {removeUser.isPending
                            ? <Spinner className="size-3.5" />
                            : <XIcon className="size-3.5" />
                        }
                    </ActionButton>
                </Activity>
            </div>
        </div>
    );
}

export default function UserList() {
    const { isPending, error, data: users } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: () => apiFetch<User[]>("/users/all"),
    });

    return (
        <div className="space-y-2">
            {isPending ? (
                Array.from({ length: 3 }).map((_, i) => <UserSkeleton key={i} />)
            ) : error ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-xs text-red-400">
                        Une erreur est survenue lors du chargement.
                    </p>
                </div>
            ) : !users?.length ? (
                <EmptyUsers />
            ) : (
                users.map((user) => <UserItem key={user.id} user={user} />)
            )}
        </div>
    );
}