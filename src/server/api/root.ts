import { createTRPCRouter } from "~/server/api/trpc";
import { clubRouter } from "./routers/club";
import { courtRouter } from "./routers/court";
import { reservationMutationRouter } from "./routers/reservation-mutation";
import { reservationQueryRouter } from "./routers/reservation-query";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  reservationMutation: reservationMutationRouter,
  reservationQuery: reservationQueryRouter,
  court: courtRouter,
  user: userRouter,
  club: clubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
