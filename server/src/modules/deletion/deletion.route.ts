import { Elysia } from "elysia"
import { authPlugin } from "../auth/auth"

export const deletionRoutes = new Elysia({ prefix: "/deletion" })
    .use(authPlugin)
    .get("/", async ({ params, status, user }) => {
        console.log({ user })
    }, { auth: true })