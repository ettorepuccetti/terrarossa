import { type PrismaClient } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import dayjs from "dayjs";
import { z } from "zod";
import { ReservationInputSchema } from "~/components/Calendar";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { UserRoles } from "~/utils/constants";

export const reservationRouter = createTRPCRouter({
  getAllVisibleInCalendar: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.reservation.findMany({
        where: {
          // retrieve only reservations that are in the visible time windows (2 days in the past, 1 week in the future)
          startTime: {
            gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              name: true,
              email: true,
              image: true
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
      if (input.startDateTime.getTime() < Date.now()) {
        throw new TRPCClientError("Server: Reservations cannot be in the past");
      }
      if (input.startDateTime.getTime() > input.endDateTime.getTime()) {
        throw new TRPCClientError("Server: Start date cannot be after end date");
      }
      if (input.overwriteName && ctx.session.user.role !== UserRoles.ADMIN) {
        throw new TRPCClientError("Server: you are not authorized to overwrite the name of the reservation");
      }
      // reservation cannot be deleted six hours before the start time, using dayJS to add 6 hours to the start time
      // exception: admin can delete reservations at any time
      const sixHoursBeforeStart = dayjs(input.startDateTime).add(6, "hour");
      if (sixHoursBeforeStart.isBefore(Date.now()) && ctx.session.user.role !== UserRoles.ADMIN) {
        throw new TRPCClientError("Server: Reservations cannot be deleted 6 hours before the start time");
      }

      return ctx.prisma.reservation.create({
        data: {
          courtId: input.courtId,
          startTime: input.startDateTime,
          endTime: input.endDateTime,
          userId: ctx.session.user.id,
          overwriteName: input.overwriteName,
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
      if (reservationToDelete?.userId !== ctx.session.user.id && ctx.session.user.role !== UserRoles.ADMIN) {
        throw new TRPCClientError("You are not authorized to delete this reservation");
      }
      // reservation cannot be deleted six hours before the start time, using dayJS to add 6 hours to the start time
      // exception: admin can delete reservations at any time
      const sixHoursBeforeStart = dayjs(reservationToDelete.startTime).add(-6, "hour");
      if (sixHoursBeforeStart.isBefore(Date.now()) && ctx.session.user.role !== UserRoles.ADMIN) {
        throw new TRPCClientError("Server: Reservations cannot be deleted 6 hours before the start time");
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