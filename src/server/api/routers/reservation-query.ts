import dayjs from "dayjs";
import { ClubIdInputSchema } from "~/components/Calendar";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reservationQueryRouter = createTRPCRouter({
  getAllVisibleInCalendarByClubId: publicProcedure
    .input(ClubIdInputSchema)
    .query(async ({ ctx, input }) => {
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
        .set("hour", 0) //TODO: use the opening time of the club
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0);
      const toDate = dayjs()
        .add(clubSettings.daysInFutureVisible + 1, "day") // +1 because hour is 00:00 (so the last day wouldn't be visible)
        .set("hour", 0) //TODO: use the closing time of the club
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0);
      console.log("toDate: ", toDate.toDate());
      console.log("fromDate: ", fromDate.locale("it").toDate());

      return await ctx.prisma.reservation.findMany({
        where: {
          AND: [
            // retrieve only reservations for courts that belong to the club
            { court: { clubId: input.clubId } },

            // retrieve only reservations that are in the visible time windows
            {
              startTime: {
                gte: fromDate.toDate(),
                lte: toDate.toDate(),
              },
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
