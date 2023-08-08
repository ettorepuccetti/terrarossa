import dayjs from "dayjs";
import { ClubIdInputSchema } from "~/components/Calendar";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { reservationConstraints } from "~/utils/constants";

export const reservationQueryRouter = createTRPCRouter({
  getAllVisibleInCalendarByClubId: publicProcedure
    .input(ClubIdInputSchema)
    .query(async ({ ctx, input }) => {
      if (typeof input.clubId !== "string") {
        throw new Error(`Server: invalid clubId`);
      }
      const fromDate = dayjs()
        .subtract(reservationConstraints.daysInThePastVisible, "day")
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0);
      const toDate = dayjs()
        .add(reservationConstraints.daysInTheFutureVisible + 1, "day")
        .set("hour", 0)
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
