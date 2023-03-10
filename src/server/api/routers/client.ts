import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
  insertOne: publicProcedure
    .input(z.object({
      Name: z.string(),
      Premium: z.boolean().nullish()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.client.create({
        data: {
          Name: input.Name,
          Premium: input.Premium,
        }
      });
    }),
});