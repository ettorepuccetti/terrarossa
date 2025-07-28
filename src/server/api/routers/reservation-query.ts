import dayjs from "dayjs";
import { reservationQueryInputSchema } from "~/hooks/calendarTrpcHooks";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";

export const reservationQueryRouter = createTRPCRouter({
  getAllVisibleInCalendarByClubId: publicProcedure
    .input(reservationQueryInputSchema)
    .query(async ({ ctx, input }) => {
      const logger = loggerInternal.child({
        userId: ctx.session?.user.id,
        context: {
          apiEndPoint: "reservationQueryRouter.getAllVisibleInCalendarByClubId",
        },
      });

      if (typeof input.clubId !== "string") {
        throw new Error(`Server: invalid clubId`);
      }
      const clubSettings = await ctx.prisma.clubSettings.findFirstOrThrow({
        where: {
          club: {
            id: input.clubId,
          },
        },
      });
      const fromDate = dayjs()
        .subtract(clubSettings.daysInThePastVisible, "day")
        .startOf("day");

      const toDate = dayjs()
        .add(clubSettings.daysInFutureVisible, "day")
        .endOf("day");

      const customSelectedDate = input.customSelectedDate
        ? dayjs(input.customSelectedDate)
        : undefined;

      logger.info("Query reservations visible in calendar time range", {
        ...input,
        fromDate: fromDate.toDate(),
        toDate: toDate.toDate(),
        customSelectedDate: customSelectedDate?.toDate(),
      });

      return await ctx.prisma.reservation.findMany({
        where: {
          AND: [
            // retrieve only reservations for courts that belong to the club
            { court: { clubId: input.clubId } },

            // retrieve only reservations that are in the visible time windows
            {
              OR: [
                {
                  startTime: {
                    gte: fromDate.toDate(),
                    lte: toDate.toDate(),
                  },
                },
                // get also reservations of the custom selected date (selectedDate may fall outside the visible time windows)
                {
                  startTime: {
                    gte: customSelectedDate?.toDate(),
                    lte: customSelectedDate?.add(1, "day").toDate(),
                  },
                },
              ],
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    }),

  getMine: protectedProcedure.query(({ ctx }) => {
    const logger = loggerInternal.child({
      userId: ctx.session?.user.id,
      context: { apiEndPoint: "reservationQueryRouter.getMine" },
    });
    logger.info("Get all reservations", { userId: ctx.session?.user.id });
    return ctx.prisma.reservation.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        court: {
          select: {
            name: true,
            Club: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }),
});
