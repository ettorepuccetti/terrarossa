import { date, z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { ItemSchema } from "~/components/ItemCRUD";

export const itemRouter = createTRPCRouter({
  // getMine: protectedProcedure
  //   .input(z.number())
  //   .query(({ ctx }) => {
  //     return ctx.prisma.item.findMany({
  //       where: {
  //       }
  //     });
  //   }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
       return await ctx.prisma.item.findMany();
    }),

  insertOne: protectedProcedure
    .input(ItemSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item.create({
        data: {
          name: input.name,
          property: input.property,
          date: input.date
        }
      });
    }),

  deleteOne: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item.delete({
        where: {
          id: input,
        }
      });
    }),
});