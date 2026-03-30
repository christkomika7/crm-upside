import { sidebar } from "@/lib/navigation"
import { Button } from "../../../components/ui/button"
import { LogOutIcon } from "lucide-react"
import Logo from "../../../assets/emerald-logo.png"
import { Link, useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/auth-client"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Sidebar() {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        setIsPending(true);
        await authClient.signOut();
        await router.invalidate();
        await router.navigate({ to: "/" });
        setIsPending(false);
    }

    return (
        <div className="bg-white z-20 h-screen w-full shadow-xl shadow-neutral-400/20 flex flex-col">
            <div className="h-16 px-4 flex items-center shrink-0">
                <img src={Logo} alt="Logo" className="size-14 object-contain object-center" />
                <h1 className="font-extrabold text-xl text-emerald-dark uppercase">CREO</h1>
            </div>

            <div className="flex-1 overflow-hidden px-3 py-4">
                <ScrollArea className="h-full pl-4" dir="rtl" >
                    <ul className="space-y-1" dir="ltr">
                        {sidebar.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.path}
                                    activeOptions={{ exact: item.exact }}
                                    activeProps={{ className: "bg-emerald-background text-white" }}
                                    inactiveProps={{ className: "text-neutral-600 hover:bg-emerald-50 hover:text-emerald-dark" }}
                                    className="flex items-center px-3 py-2 rounded-md text-sm transition-colors"
                                >
                                    <item.icon className="size-4 mr-3 shrink-0" />
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>

            <div className="h-12 px-4 flex items-center shrink-0">
                <Button
                    onClick={handleLogout}
                    disabled={isPending}
                    variant="logout"
                    className="w-full text-sm"
                >
                    {isPending ? <Spinner /> : <LogOutIcon className="size-4" />}
                    Déconnexion
                </Button>
            </div>
        </div>
    )
}