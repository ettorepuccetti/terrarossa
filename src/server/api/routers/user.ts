import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";

export const userRouter = createTRPCRouter({
  getInfo: protectedProcedure.query(({ ctx }) => {
    const logger = loggerInternal.child({ apiEndPoint: "userRouter.getInfo" });
    logger.info({ userId: ctx.session?.user.id }, "get user info");
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  deleteUser: protectedProcedure.mutation(({ ctx }) => {
    const logger = loggerInternal.child({
      apiEndPoint: "userRouter.deleteUser",
    });
    logger.warn({ userId: ctx.session?.user.id }, "delete user");
    return ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
