import { ClubIdInputSchema } from "~/components/Calendar";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const courtRouter = createTRPCRouter({
  getAllByClubId: publicProcedure
    .input(ClubIdInputSchema)
    .query(async ({ ctx, input }) => {
      //clubId come from the router, so it can also be an array of strings, or undefined
      if (typeof input.clubId !== "string") {
        throw new Error(`Server: invalid clubId`);
      }
      return await ctx.prisma.court.findMany({
        where: {
          clubId: input.clubId,
        },
      });
    }),
});
