import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";
import { r2 } from "~/utils/r2";

const R2_USER_IMAGE_PREFIX = "userImage_";
const R2_BUCKET_URL = "https://r2.terrarossa.app/";

export const userRouter = createTRPCRouter({
  getInfo: protectedProcedure.query(({ ctx }) => {
    const logger = loggerInternal.child({ apiEndPoint: "userRouter.getInfo" });
    logger.info({ userId: ctx.session?.user.id }, "Get user info");
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
    logger.warn({ userId: ctx.session?.user.id }, "Delete user");
    return ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  getSignedUrlForUploadImage: protectedProcedure.mutation(async ({ ctx }) => {
    const logger = loggerInternal.child({
      apiEndPoint: "userRouter.getSignedUrlForUploadImage",
    });
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: R2_USER_IMAGE_PREFIX + ctx.session.user.id,
      }),
      { expiresIn: 60 },
    );
    logger.info(
      { userId: ctx.session?.user.id, signedUrl: signedUrl },
      "Generate signed url for upload image",
    );
    return { url: signedUrl };
  }),

  updateImageSrc: protectedProcedure.mutation(async ({ ctx }) => {
    const logger = loggerInternal.child({
      apiEndPoint: "userRouter.updateImageSrc",
    });
    const imageSrc = R2_BUCKET_URL + R2_USER_IMAGE_PREFIX + ctx.session.user.id;
    logger.info(
      { userId: ctx.session?.user.id, imageSrc: imageSrc },
      "Update user image",
    );
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        image: imageSrc,
      },
    });
  }),
});
