import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const clubRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.club.findMany();
  }),
});
