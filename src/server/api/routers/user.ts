import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import chalk from "chalk";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";
import { r2 } from "~/utils/r2";

const R2_USER_IMAGE_PREFIX = "userImage_";
const R2_BUCKET_URL = "https://r2.terrarossa.app/";

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

  uploadImage: protectedProcedure.mutation(async ({ ctx }) => {
    console.log(chalk.yellow(`Generating an upload URL!`));
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: R2_USER_IMAGE_PREFIX + ctx.session.user.id,
      }),
      { expiresIn: 60 },
    );
    console.log(chalk.green(`Success generating upload URL! `), signedUrl);
    return { url: signedUrl };
  }),

  updateImageSrc: protectedProcedure.mutation(async ({ ctx }) => {
    console.log(chalk.yellow(`Updating image src!`));
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        image: R2_BUCKET_URL + R2_USER_IMAGE_PREFIX + ctx.session.user.id,
      },
    });
  }),
});
