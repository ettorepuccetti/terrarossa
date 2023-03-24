import { z } from "zod";
import { ReservationInputSchema } from "~/components/Calendar";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const reservationRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.reservation.findMany({
        include: {
          user: {
            select: {
              id: true,
              role: true,
              name: true,
              email: true,
            }
          }
        },
      });
    }),

  getMine: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.reservation.findMany({
        where: {
          userId: ctx.session.user.id
        }
      });
    }),

  insertOne: protectedProcedure
    .input(ReservationInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.reservation.create({
        data: {
          courtId: input.courtId,
          startTime: input.startDateTime,
          endTime: input.endDateTime,
          userId: ctx.session.user.id
        }
      });
    }),

  deleteOne: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const reservationToDelete = await ctx.prisma.reservation.findUnique({ where: { id: input } });
      if (reservationToDelete === null) {
        throw new Error("Reservation does not exist. Id: " + input.toString());
      }
      if (reservationToDelete?.userId !== ctx.session.user.id && ctx.session.user.role !== "ADMIN") {
        throw new Error("You are not authorized to delete this reservation");
      }
      return ctx.prisma.reservation.delete({
        where: {
          id: input,
        }
      });
    }),

})