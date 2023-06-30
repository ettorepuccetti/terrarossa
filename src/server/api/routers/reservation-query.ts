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
      return await ctx.prisma.reservation.findMany({
        where: {
          AND: [
            // retrieve only reservations for courts that belong to the club
            { court: { clubId: input.clubId } },

            // retrieve only reservations that are in the visible time windows
            {
              startTime: {
                gte: dayjs()
                  .subtract(reservationConstraints.dayInThePastVisible, "day")
                  .toDate(),
                lte: dayjs()
                  .add(reservationConstraints.daysInTheFutureVisible, "day")
                  .toDate(),
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
