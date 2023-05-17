import { type PrismaClient } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { ReservationInputSchema } from "~/components/Calendar";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

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
    .mutation(async ({ ctx, input }) => {
      if (await collision(ctx.prisma, input.startDateTime, input.endDateTime, input.courtId)) {
        throw new TRPCClientError("Server: Reservation collision");
      }
      if (!checkDuration(input.startDateTime, input.endDateTime)) {
        throw new TRPCClientError("Server: Reservations needs to be at least 1 hour and not longer than 2 hours");
      }
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

function checkDuration(startDateTime: Date, endDateTime: Date) {
  const timeDuration = endDateTime.getTime() - startDateTime.getTime();
  const hours = timeDuration / (1000 * 3600);
  return hours >= 1 && hours <= 2;
}

async function collision(prisma: PrismaClient, startDateTime: Date, endDateTime: Date, courtId: string): Promise<boolean> {
  const reservations = await prisma.reservation.findMany({
    where: {
      AND: [
        {
          courtId: courtId
        },
        {
          OR: [
            {
              // Check if the new reservation starts within an existing reservation
              AND: [
                { startTime: { lte: startDateTime } },
                { endTime: { gt: startDateTime } },
              ],
            },
            {
              // Check if the new reservation ends within an existing reservation
              AND: [
                { startTime: { lt: endDateTime } },
                { endTime: { gte: endDateTime } },
              ],
            },
            {
              // Check if the new reservation completely overlaps with an existing reservation
              AND: [
                { startTime: { gte: startDateTime } },
                { endTime: { lte: endDateTime } },
              ],
            },
          ]
        }]
    },
  });
  console.log("Reservations collisions: ", reservations);
  return reservations.length !== 0;
}