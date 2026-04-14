import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path"


// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
			routeFileIgnorePrefix: "-",
			quoteStyle: "single",
		}),
		tailwindcss(),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
	],
	server: {
		host: true,
		port: 5173,
		allowedHosts: ['crm.upside-gabon.com', 'localhost'],
		proxy: {
			"/api": {
				target: "https://api.upside-gabon.com",
				// target: "http://localhost:3001",
				changeOrigin: true,
			},
		},

	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
