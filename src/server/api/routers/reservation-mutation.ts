import { type PrismaClient } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import dayjs from "dayjs";
import { z } from "zod";
import { ReservationInputSchema } from "~/components/Calendar";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UserRoles, reservationConstraints } from "~/utils/constants";

export const reservationMutationRouter = createTRPCRouter({
  insertOne: protectedProcedure
    .input(ReservationInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (
        await collision(
          ctx.prisma,
          input.startDateTime,
          input.endDateTime,
          input.courtId
        )
      ) {
        throw new TRPCClientError("Error: Reservation collision");
      }

      if (input.startDateTime.getTime() > input.endDateTime.getTime()) {
        throw new TRPCClientError("Error: Start date cannot be after end date");
      }

      //checks for NON ADMIN user
      if (!(ctx.session.user.role === UserRoles.ADMIN)) {
        // reservation length
        if (!checkDuration(input.startDateTime, input.endDateTime)) {
          throw new TRPCClientError(
            "Error: Reservations needs to be at least 1 hour and not longer than 2 hours"
          );
        }

        // reservation in the past
        if (input.startDateTime.getTime() < Date.now()) {
          throw new TRPCClientError(
            "Error: Reservations cannot be in the past"
          );
        }

        // name overwrite
        if (input.overwriteName) {
          throw new TRPCClientError(
            "Error: you are not authorized to overwrite the name of the reservation"
          );
        }
      }

      return ctx.prisma.reservation.create({
        data: {
          courtId: input.courtId,
          startTime: input.startDateTime,
          endTime: input.endDateTime,
          userId: ctx.session.user.id,
          overwriteName: input.overwriteName,
        },
      });
    }),

  deleteOne: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const reservationToDelete = await ctx.prisma.reservation.findUnique({
        where: { id: input },
      });

      if (reservationToDelete === null) {
        throw new Error("Reservation does not exist. Id: " + input.toString());
      }
      if (
        reservationToDelete?.userId !== ctx.session.user.id &&
        ctx.session.user.role !== UserRoles.ADMIN
      ) {
        throw new TRPCClientError(
          "You are not authorized to delete this reservation"
        );
      }
      // reservation deleting timewindow
      if (
        dayjs(reservationToDelete?.startTime)
          .add(reservationConstraints.hoursBeforeDeleting, "hour")
          .isBefore(Date.now())
      ) {
        throw new TRPCClientError(
          "Error: Reservations cannot be deleted 6 hours before the start time"
        );
      }

      return ctx.prisma.reservation.delete({
        where: {
          id: input,
        },
      });
    }),
});

function checkDuration(startDateTime: Date, endDateTime: Date) {
  const timeDuration = endDateTime.getTime() - startDateTime.getTime();
  const hours = timeDuration / (1000 * 3600);
  return hours >= 1 && hours <= 2;
}

async function collision(
  prisma: PrismaClient,
  startDateTime: Date,
  endDateTime: Date,
  courtId: string
): Promise<boolean> {
  const reservations = await prisma.reservation.findMany({
    where: {
      AND: [
        {
          courtId: courtId,
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
          ],
        },
      ],
    },
  });
  return reservations.length !== 0;
}
