import { ClubIdInputSchema } from "~/components/Calendar";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const courtRouter = createTRPCRouter({
  getAllByClubId: publicProcedure
    .input(ClubIdInputSchema)
    .query(async ({ ctx, input }) => {
      if (typeof input.clubId !== "string") { //clubId come from the router, so it can also be an array of strings, or undefined
        throw new Error(`Server: invalid clubId`);
      }
      return await ctx.prisma.court.findMany({
        where: {
          clubId: input.clubId,
        },
      });
    }),
});
