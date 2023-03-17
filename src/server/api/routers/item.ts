import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { ItemSchema } from "~/components/ItemCRUD";

export const itemRouter = createTRPCRouter({
  getMine: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.item.findMany({
        where: {
          userId: ctx.session.user.id
        }
      });
    }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.item.findMany({
        include: {
          user: true
        },
      }
      );
    }),

  insertOne: protectedProcedure
    .input(ItemSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item.create({
        data: {
          name: input.name,
          property: input.property,
          date: input.date,
          userId: ctx.session.user.id
        }
      });
    }),

  deleteOne: protectedProcedure
    .input(z.number())
    .mutation( async ({ ctx, input }) => {
      const itemToDelete = await ctx.prisma.item.findUnique({where: { id: input }});
      if (itemToDelete?.userId !== ctx.session.user.id && ctx.session.user.role !== "ADMIN") {
        throw new Error("You are not authorized to delete this item");
      }
      return ctx.prisma.item.delete({
        where: {
          id: input,
        }
      });
    }),
});