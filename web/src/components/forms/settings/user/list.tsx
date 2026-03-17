import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, crudService } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    BadgeCheckIcon, EditIcon, KeySquareIcon,
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
        <Item variant="muted" size="sm">
            <ItemMedia variant="default">
                <Skeleton className="size-12 rounded-full" />
            </ItemMedia>
            <ItemContent className="-space-y-1 flex-1">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-3 w-48 rounded-md mt-1" />
            </ItemContent>
            <ItemActions>
                <Skeleton className="size-10 rounded-md" />
                <Skeleton className="size-10 rounded-md" />
                <Skeleton className="size-10 rounded-md" />
                <Skeleton className="size-10 rounded-md" />
                <Skeleton className="size-10 rounded-md" />
            </ItemActions>
        </Item>
    );
}

function EmptyUsers() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="p-4 rounded-full bg-muted">
                <UsersIcon className="size-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Aucun utilisateur</p>
                <p className="text-xs text-muted-foreground">
                    Il n'y a aucun utilisateur enregistré pour le moment.
                </p>
            </div>
        </div>
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
        mutationFn: (userId: string) =>
            crudService.delete(`/users/${userId}`),
        onSuccess() {
            toast.success("Utilisateur supprimé avec succès");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: Error) => {
            console.error("Erreur:", error.message);
            toast.error(error.message);
        },
    });

    return (
        <Item variant="muted" size="sm">
            <ItemMedia variant="default">
                <Avatar className="size-12">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent className="-space-y-1">
                <ItemTitle className="gap-x-0.5">
                    {user.name}
                    {user.role === "ADMIN" && (
                        <BadgeCheckIcon className="size-5 fill-blue-500 text-white" />
                    )}
                </ItemTitle>
                <ItemDescription>{user.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Modal
                    open={open.edit}
                    setOpen={() => setOpen({ ...open, edit: !open.edit })}
                    title="Modifier l'utilisateur"
                    action={
                        <Button variant="action" className="size-10! px-0! ring-0 bg-amber-500/15 text-amber-500 hover:bg-amber-500/30">
                            <EditIcon className="size-4" />
                        </Button>
                    }
                >
                    <EditUser id={user.id} firstname={user.firstname} lastname={user.lastname} image={user.image} close={() => setOpen({ ...open, edit: false })} />
                </Modal>

                <Modal
                    open={open.permissions}
                    setOpen={() => setOpen({ ...open, permissions: !open.permissions })}
                    className="max-w-5xl!"
                    title="Modifier les permissions"
                    action={
                        <Button variant="action" className="size-10! px-0! ring-0 bg-green-500/15 text-green-400 hover:bg-green-500/30">
                            <KeySquareIcon className="size-4" />
                        </Button>
                    }
                >
                    <SetPermissions id={user.id} permission={user.permission?.permissions} close={() => setOpen({ ...open, permissions: false })} />
                </Modal>

                <Modal
                    open={open.email}
                    setOpen={() => setOpen({ ...open, email: !open.email })}
                    title="Modifier l'email"
                    action={
                        <Button variant="action" className="size-10! px-0! ring-0 bg-indigo-500/15 text-indigo-500 hover:bg-indigo-500/30">
                            <AtSignIcon className="size-4" />
                        </Button>
                    }
                >
                    <EditUserEmail id={user.id} email={user.email} close={() => setOpen({ ...open, email: false })} />
                </Modal>
                <Modal
                    open={open.password}
                    setOpen={() => setOpen({ ...open, password: !open.password })}
                    title="Modifier le mot de passe"
                    action={
                        <Button variant="action" className="size-10! px-0! ring-0 bg-blue-500/15 text-blue-500 hover:bg-blue-500/30">
                            <LockIcon className="size-4" />
                        </Button>
                    }
                >
                    <EditUserPassword id={user.id} close={() => setOpen({ ...open, password: false })} />
                </Modal>

                <Activity mode={user.role === "ADMIN" ? "hidden" : "visible"}>
                    <Button onClick={() => removeUser.mutate(user.id)} disabled={removeUser.isPending} variant="action" className="size-10! px-0! ring-0 bg-destructive/15 text-destructive hover:bg-destructive/30">
                        {removeUser.isPending ? <Spinner className="size-4 animate-spin" /> : <XIcon className="size-4" />}
                    </Button>
                </Activity>
            </ItemActions>
        </Item>
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
                Array.from({ length: 3 }).map((_, i) => (
                    <UserSkeleton key={i} />
                ))
            ) : error ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-destructive">
                        Une erreur est survenue lors du chargement.
                    </p>
                </div>
            ) : !users?.length ? (
                <EmptyUsers />
            ) : (
                users.map((user) => (
                    <UserItem key={user.id} user={user} />
                ))
            )}
        </div>
    );
}