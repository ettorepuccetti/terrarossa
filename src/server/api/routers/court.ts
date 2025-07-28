import { ClubIdInputSchema } from "~/hooks/calendarTrpcHooks";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";

export const courtRouter = createTRPCRouter({
  getAllByClubId: publicProcedure
    .input(ClubIdInputSchema)
    .query(async ({ ctx, input }) => {
      const logger = loggerInternal.child({
        userId: ctx.session?.user.id,
        context: { apiEndPoint: "courtRouter.getAllByClubId" },
      });
      //clubId come from the router, so it can also be an array of strings, or undefined
      if (typeof input.clubId !== "string") {
        logger.error("invalid clubId", {
          userId: ctx.session?.user.id,
          clubId: input.clubId,
        });
        throw new Error(
          `Si è verificato un errore, per favore riprova (Invalid clubId)`,
        );
      }
      return await ctx.prisma.court.findMany({
        where: {
          clubId: input.clubId,
        },
      });
    }),
});
