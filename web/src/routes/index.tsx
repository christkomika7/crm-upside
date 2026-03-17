import Login from "@/components/auth/login";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Logo from "../assets/logo.png"

export const Route = createFileRoute("/")({
	beforeLoad({ context }) {
		if (context.session?.data?.user) {
			throw redirect({ to: "/dashboard" })
		}

	},
	component: Homepage,
});

function Homepage() {
	return (
		<div className="w-dvw min-h-dvh bg-emerald-background grid grid-cols-[1fr_1.5fr]">
			<div className="flex flex-col items-center justify-center text-white">
				<div className="size-40">
					<img src={Logo} alt="Logo CREO" />
				</div>
				<h1 className="text-7xl font-black tracking-[.5rem]">CREO</h1>
				<p>Gestion immobilière intelligente</p>
			</div>
			<div className="bg-white rounded-l-2xl flex flex-col justify-center items-center">
				<h2 className="text-emerald-dark text-3xl font-extrabold mb-2">Connexion</h2>
				<p className="text-neutral-600 mb-12">Entrez les informations requises pour vous connecter</p>
				<Login />
				<Link to="/" className="text-emerald-dark text-sm hover:underline mt-4">
					Mot de passe oublié ?
				</Link>
			</div>
		</div>
	);
}
