import { ClubIdInputSchema } from "~/hooks/calendarTrpcHooks";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";

export const clubRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const logger = loggerInternal.child({ apiEndPoint: "clubRouter.getAll" });
    logger.info({ userId: ctx.session?.user.id }, "get all clubs");
    return await ctx.prisma.club.findMany({
      include: {
        Address: true,
      },
    });
  }),

  getByClubId: publicProcedure
    .input(ClubIdInputSchema)
    .query(async ({ ctx, input }) => {
      const logger = loggerInternal.child({
        apiEndPoint: "clubRouter.getByClubId",
      });
      if (typeof input.clubId !== "string") {
        //clubId come from the router, so it can also be an array of strings, or undefined
        logger.error(
          { userId: ctx.session?.user.id, clubId: input.clubId },
          "invalid clubId",
        );
        throw new Error(
          `Si è verificato un errore, per favore riprova (Invalid clubId)`,
        );
      }
      return await ctx.prisma.club.findUniqueOrThrow({
        where: {
          id: input.clubId,
        },
        include: {
          clubSettings: true,
          Address: true,
          PhoneNumber: true,
        },
      });
    }),
});
