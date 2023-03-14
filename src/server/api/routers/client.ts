import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const clientRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.prisma.client.findFirst({
        where: {
          id: input,
        }
      });
    }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
       return await ctx.prisma.client.findMany();
    }),

  insertOne: protectedProcedure
    .input(z.object({
      name: z.string(),
      premium: z.boolean().nullish()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.client.create({
        data: {
          name: input.name,
          premium: input.premium,
        }
      });
    }),

  deleteOne: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.client.delete({
        where: {
          id: input,
        }
      });
    }),
});