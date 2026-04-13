import { Elysia, t } from "elysia";

import { betterAuthPlugin } from "./lib/auth";
import { envPlugin } from "./lib/env";
import { corsPlugin } from "./lib/cors";
import { loggerPlugin } from "./lib/logger";
import { route } from "./lib/routes";
import { wsPlugin } from "./lib/socket";


const app = new Elysia()
  .use(envPlugin)
  .use(corsPlugin)
  .use(betterAuthPlugin)
  .use(wsPlugin)
  .use(route)
  // .use(loggerPlugin)
  .listen(3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;