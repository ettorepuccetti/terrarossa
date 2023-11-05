import dayjs from "dayjs";
import { reservationQueryInputSchema } from "~/components/Calendar";
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
        apiEndPoint: "reservationQueryRouter.getAllVisibleInCalendarByClubId",
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

      logger.info({
        ...input,
        fromDate: fromDate.locale("it").toDate(),
        toDate: toDate.locale("it").toDate(),
        customSelectedDate: customSelectedDate?.locale("it").toDate(),
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
      apiEndPoint: "reservationQueryRouter.getMine",
    });
    logger.info({ userId: ctx.session?.user.id }, "get all reservations");
    return ctx.prisma.reservation.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        court: {
          select: {
            name: true,
          },
        },
      },
    });
  }),
});
