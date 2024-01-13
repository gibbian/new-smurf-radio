import { createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "./admin";
import { djRouter } from "./djs";
import { memberRouter } from "./member";
import { showRouter } from "./show";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  djs: djRouter,
  member: memberRouter,
  shows: showRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
