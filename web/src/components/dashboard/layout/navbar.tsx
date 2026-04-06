import { authClient } from "@/lib/auth/auth-client";
import Account from "./account";
import Notification from "./notification";
import Searchbar from "./searchbar";

export default function Navbar() {
    const session = authClient.useSession();
    const user = session.data?.user;

    return (
        <div className="h-16 bg-white shadow-md shadow-neutral-300/20 p-4 flex items-center justify-between">
            <h2 className="ml-4">Bonjour {user?.name} , Bienvenue sur votre Dashboard 🚀</h2>
            <div className="flex items-center gap-x-8">
                <Searchbar />
                <div className="gap-x-3 flex items-center">
                    <Notification />
                    <Account name={user?.name || "Utilisateur"} image={user?.image || undefined} />
                </div>
            </div>
        </div>
    )
}
