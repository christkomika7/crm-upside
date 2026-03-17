import { sidebar } from "@/lib/navigation"
import { Button } from "../../../components/ui/button"
import { LogOutIcon } from "lucide-react"

import Logo from "../../../assets/emerald-logo.png"
import { Link, useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/auth-client"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"


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
        <div className="bg-white z-20 h-full w-full shadow-xl shadow-neutral-400/20">
            <div className="h-16 p-4 flex items-center">
                <img src={Logo} alt="Logo" className="size-13 object-contain object-center" />
                <h1 className="font-extrabold text-xl text-emerald-dark uppercase">CREO</h1>
            </div>
            <div>
                <ul className="py-4 px-3">
                    {sidebar.map((item) => (
                        <li key={item.id} className="mb-1">
                            <Link to={item.path} className="flex items-center px-3 py-2 rounded-md hover:bg-emerald-background hover:text-white">
                                <item.icon className="size-4 mr-3" />
                                <span className="text-xs">{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="px-4">
                    <Button
                        onClick={handleLogout}
                        disabled={isPending}
                        variant="logout" className="w-full mt-4 text-xs">
                        {isPending ? <Spinner /> : <LogOutIcon className="size-4" />}
                        Deconnexion</Button>
                </div>
            </div>
        </div>
    )
}
