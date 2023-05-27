import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { courtRouter } from "./routers/court";
import { reservationRouter } from "./routers/reservation";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  reservation: reservationRouter,
  court: courtRouter,
  example: exampleRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
