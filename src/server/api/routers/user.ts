import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { loggerInternal } from "~/utils/logger";
import { r2 } from "~/utils/r2";

const R2_USER_IMAGE_PREFIX = "userImage/";

export const userRouter = createTRPCRouter({
  getInfo: protectedProcedure.query(({ ctx }) => {
    const logger = loggerInternal.child({
      userId: ctx.session?.user.id,
      context: { apiEndPoint: "userRouter.getInfo" },
    });
    logger.info("Get user info");
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        phoneNumber: true,
      },
    });
  }),

  deleteUser: protectedProcedure.mutation(({ ctx }) => {
    const logger = loggerInternal.child({
      userId: ctx.session?.user.id,
      context: { apiEndPoint: "userRouter.deleteUser" },
    });
    logger.warn("Delete user");
    return ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  getSignedUrlForUploadImage: protectedProcedure.mutation(async ({ ctx }) => {
    const logger = loggerInternal.child({
      userId: ctx.session?.user.id,
      context: { apiEndPoint: "userRouter.getSignedUrlForUploadImage" },
    });
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
        Key: R2_USER_IMAGE_PREFIX + ctx.session.user.id,
      }),
      { expiresIn: 60 },
    );
    logger.info("Generate signed url for upload image", {
      signedUrl: signedUrl,
    });
    return signedUrl;
  }),

  updateImageSrc: protectedProcedure.mutation(async ({ ctx }) => {
    const logger = loggerInternal.child({
      userId: ctx.session?.user.id,
      context: { apiEndPoint: "userRouter.updateImageSrc" },
    });
    const imageSrc =
      env.NEXT_PUBLIC_R2_BUCKET_URL +
      R2_USER_IMAGE_PREFIX +
      ctx.session.user.id;
    logger.info("Update user image", {
      imageSrc: imageSrc,
    });
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        image: imageSrc,
      },
    });
  }),

  updateUsername: protectedProcedure
    .input(z.object({ newUsername: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const logger = loggerInternal.child({
        userId: ctx.session?.user.id,
        context: { apiEndPoint: "userRouter.updateUsername" },
      });
      logger.info("Update username", {
        newUsername: input.newUsername,
      });
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.newUsername,
        },
      });
    }),
  updatePhoneNumber: protectedProcedure
    .input(z.object({ nationalPrefix: z.string(), phoneNumber: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const logger = loggerInternal.child({
        userId: ctx.session?.user.id,
        context: { apiEndPoint: "userRouter.updatePhoneNumber" },
      });
      logger.info("Update phone number", {
        nationalPrefix: input.nationalPrefix,
        phoneNumber: input.phoneNumber,
      });
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          phoneNumber: {
            create: {
              nationalPrefix: input.nationalPrefix,
              number: input.phoneNumber,
            },
          },
        },
      });
    }),
});
