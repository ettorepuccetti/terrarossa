import { type Prisma, type PrismaClient } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import dayjs from "dayjs";
import {
  RecurrentReservationInputSchema,
  ReservationDeleteInputSchema,
  ReservationInputSchema,
} from "~/components/Calendar";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UserRoles, type UserRole } from "~/utils/constants";

export const reservationMutationRouter = createTRPCRouter({
  insertOne: protectedProcedure
    .input(ReservationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const clubSettings = await getClubSettings(ctx, input.clubId);

      //collision check [UI does NOT check for this]
      if (
        await collision(
          ctx.prisma,
          input.startDateTime,
          input.endDateTime,
          input.courtId
        )
      ) {
        throw new TRPCClientError(
          "La tua prenotazione non puo' essere effettuata. Per favore, scegli un orario in cui il campo è libero"
        );
      }

      // start date before end date [UI already prevents this]
      if (input.startDateTime.getTime() > input.endDateTime.getTime()) {
        throw new TRPCClientError(
          "L'orario di inizio deve essere prima di quello di fine"
        );
      }

      // start and end time must be `00` or `30` [UI already prevents this]
      if (
        input.startDateTime.getMinutes() % 30 !== 0 ||
        input.endDateTime.getMinutes() % 30 !== 0
      ) {
        throw new TRPCClientError(
          "L'orario di inizio e di fine deve essere un multiplo di 30 minuti"
        );
      }

      //checks for NON ADMIN user
      if (!isUserAdminOfClub(ctx, input.clubId)) {
        // check limit of active reservations per users [UI does NOT check for this]
        const activeReservationsForUser = await getUserActiveReservations(
          ctx,
          input.clubId
        );
        if (activeReservationsForUser >= clubSettings.maxReservationPerUser) {
          throw new TRPCClientError(
            `Hai raggiunto il numero massimo di prenotazioni attive (${clubSettings.maxReservationPerUser})`
          );
        }
        // reservation length [UI already prevents this]
        if (!checkDuration(input.startDateTime, input.endDateTime)) {
          throw new TRPCClientError(
            "Error: Reservations needs to be at least 1 hour and not longer than 2 hours"
          );
        }

        // reservation in the past [UI already prevents this]
        if (input.startDateTime.getTime() < Date.now()) {
          throw new TRPCClientError(
            "Error: Reservations cannot be in the past"
          );
        }

        // name overwrite [UI already prevents this]
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

  insertRecurrent: protectedProcedure
    .input(RecurrentReservationInputSchema)
    .mutation(async ({ ctx, input }) => {
      // check for privileges [UI already prevents this]
      if (!isUserAdminOfClub(ctx, input.clubId)) {
        throw new TRPCClientError(
          "Error: Only admins can create recurrent reservations"
        );
      }
      // create the recurrent reservation at which the reservations will refer to
      const recurrentDbEntity = await ctx.prisma.recurrentReservation.create({
        data: {
          endDate: input.recurrentEndDate,
          startDate: input.startDateTime,
        },
      });
      //add to reservations array a reservation for each week from input.startDate to input.endDate
      const reservations = [];
      for (
        let date = dayjs(input.startDateTime);
        date.isBefore(input.recurrentEndDate);
        date = date.add(1, "week")
      ) {
        const reservationInput = {
          courtId: input.courtId,
          startTime: date.toDate(),
          endTime: date
            .hour(input.endDateTime.getHours())
            .minute(input.endDateTime.getMinutes())
            .toDate(),
          userId: ctx.session.user.id,
          overwriteName: input.overwriteName,
          recurrentReservationId: recurrentDbEntity.id,
        };

        //check for collision [UI does NOT check for this]
        if (
          await collision(
            ctx.prisma,
            reservationInput.startTime,
            reservationInput.endTime,
            reservationInput.courtId
          )
        ) {
          throw new TRPCClientError(
            "Errore nella creazione della prenotazione ricorrente.\
            Confiltto in data " + date.format("DD/MM/YYYY")
          );
        }
        reservations.push(reservationInput);
      }

      await ctx.prisma.reservation.createMany({
        data: reservations,
      });
    }),

  deleteOne: protectedProcedure
    .input(ReservationDeleteInputSchema)
    .mutation(async ({ ctx, input }) => {
      const clubSettings = await getClubSettings(ctx, input.clubId);
      const reservationToDelete =
        await ctx.prisma.reservation.findUniqueOrThrow({
          where: { id: input.reservationId },
        });

      //checks for NON ADMIN user
      // TODO: check that user is admin of the club for which the reservation is made.
      // Possible exploit: admin of club A can delete reservation of club B
      if (!isUserAdminOfClub(ctx, input.clubId)) {
        // delete reservation of other users
        if (reservationToDelete.userId !== ctx.session.user.id) {
          throw new TRPCClientError(
            "You are not authorized to delete this reservation"
          );
        }

        // reservation deleting timewindow
        if (
          dayjs(reservationToDelete.startTime)
            .add(clubSettings.hoursBeforeCancel, "hour")
            .isBefore(Date.now())
        ) {
          throw new TRPCClientError(
            `Error: Reservations cannot be deleted ${clubSettings.hoursBeforeCancel} hours before the start time`
          );
        }
      }

      return ctx.prisma.reservation.delete({
        where: {
          id: input.reservationId,
        },
      });
    }),
});

async function getClubSettings(ctx: CtxType, clubId: string) {
  return await ctx.prisma.clubSettings.findFirstOrThrow({
    where: {
      club: {
        id: clubId,
      },
    },
  });
}

function isUserAdminOfClub(ctx: CtxType, clubId: string) {
  return (
    ctx.session.user.role === UserRoles.ADMIN &&
    ctx.session.user.clubId === clubId
  );
}

async function getUserActiveReservations(ctx: CtxType, clubId: string) {
  const activeReservationsForUser = await ctx.prisma.reservation.groupBy({
    by: ["userId"],
    where: {
      userId: ctx.session.user.id,
      endTime: {
        gte: dayjs().toDate(),
      },
      //check that clubId is the same as the one of the court
      court: {
        clubId: clubId,
      },
    },
    _count: {
      userId: true,
    },
  });
  console.log(
    "Active reservations",
    activeReservationsForUser[0]?._count.userId
  );
  return activeReservationsForUser[0]?._count.userId ?? 0;
}

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

type CtxType = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never | undefined>;
  session: {
    user: {
      id: string;
      role: UserRole;
      clubId?: string | undefined;
    } & {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
    expires: string;
  };
};
