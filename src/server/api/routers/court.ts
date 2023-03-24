import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const courtRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.court.findMany();
  }),
})