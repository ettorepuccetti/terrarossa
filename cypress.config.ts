import { PrismaClient } from "@prisma/client";
import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  projectId: "y4edyf",
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    watchForFileChanges: false,
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: "test",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
      AUTH0_ISSUER: process.env.AUTH0_ISSUER,
      AUTH0_BASE_URL: process.env.AUTH_BASE_URL,
    },
    setupNodeEvents(on, config) {
      const prisma = new PrismaClient();

      on("task", {
        "prisma:queryClubs"() {
          return prisma.club.findMany();
        },
        "prisma:queryFilteredClubs"(filter: string) {
          return prisma.club.findMany({
            where: {
              name: {
                contains: filter,
              },
            },
          });
        },
        "prisma:deleteAllReservationOfClub"(clubId: string) {
          if (!clubId) throw new Error("clubId is undefined");
          return prisma.reservation.deleteMany({
            where: {
              court: {
                clubId: clubId,
              },
            },
          });
        },
        async "prisma:makeReservation"({
          startTime,
          endTime,
          clubId,
          userId,
        }: {
          startTime: Date;
          endTime: Date;
          clubId: string;
          userId?: string;
        }) {
          const court = await prisma.court.findFirst({
            where: {
              clubId: clubId,
            },
          });
          if (!court) throw new Error("Court not found");
          return await prisma.reservation.create({
            data: {
              startTime: startTime,
              endTime: endTime,
              court: {
                connect: {
                  id: court.id,
                },
              },
            },
          });
        },
      });
      return config;
    },
  },

  component: {
    watchForFileChanges: false,
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
