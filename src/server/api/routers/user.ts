import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import chalk from "chalk";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";
import { r2 } from "~/utils/r2";

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
  uploadImage: publicProcedure
    .input(
      z.object({
        filename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(chalk.yellow(`Generating an upload URL!`));
      const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: input.filename,
        }),
        { expiresIn: 60 },
      );
      console.log(chalk.green(`Success generating upload URL! `), signedUrl);
      return { url: signedUrl };
    }),
});
